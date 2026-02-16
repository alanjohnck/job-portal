# Backend Support Ticket Implementation Guide

## 🚨 Current Issue
The frontend is trying to call `/api/v1/support/tickets` but getting **404 Not Found** because the backend endpoints don't exist yet.

## 📋 Required Backend Implementation

### 1. Database Model/Entity
Create a `SupportTicket` entity:

```csharp
public class SupportTicket
{
    public Guid Id { get; set; }
    public string TicketNumber { get; set; } // e.g., "T-1001"
    public Guid UserId { get; set; }
    public string UserName { get; set; }
    public string UserType { get; set; } // "Candidate" or "Company"
    public string Subject { get; set; }
    public string Description { get; set; }
    public string Priority { get; set; } // "Low", "Medium", "High"
    public string Type { get; set; } // "General", "Technical", "Billing", "Account"
    public string Status { get; set; } // "Open", "InProgress", "Closed"
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation
    public User User { get; set; }
}
```

### 2. DTOs
Create support ticket DTOs:

```csharp
// DTOs/SupportTicketDTOs.cs
public class CreateSupportTicketDto
{
    public string Subject { get; set; }
    public string Description { get; set; }
    public string Priority { get; set; } = "Medium";
    public string Type { get; set; } = "General";
}

public class SupportTicketDto
{
    public Guid Id { get; set; }
    public string TicketNumber { get; set; }
    public string Subject { get; set; }
    public string Description { get; set; }
    public string Priority { get; set; }
    public string Type { get; set; }
    public string Status { get; set; }
    public string UserName { get; set; }
    public string UserType { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class UpdateTicketStatusDto
{
    public string Status { get; set; }
}
```

### 3. Service Interface

```csharp
// Services/ISupportTicketService.cs
public interface ISupportTicketService
{
    Task<SupportTicketDto> CreateTicketAsync(Guid userId, CreateSupportTicketDto dto);
    Task<PagedResult<SupportTicketDto>> GetMyTicketsAsync(Guid userId, string status, int page, int pageSize);
    Task<PagedResult<SupportTicketDto>> GetAllTicketsAsync(string status, string priority, string type, int page, int pageSize);
    Task<SupportTicketDto> GetTicketByIdAsync(Guid ticketId);
    Task<SupportTicketDto> UpdateTicketStatusAsync(Guid ticketId, string status);
}
```

### 4. Service Implementation

```csharp
// Services/SupportTicketService.cs
public class SupportTicketService : ISupportTicketService
{
    private readonly ApplicationDbContext _context;
    
    public SupportTicketService(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public async Task<SupportTicketDto> CreateTicketAsync(Guid userId, CreateSupportTicketDto dto)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) throw new Exception("User not found");
        
        // Generate ticket number
        var ticketCount = await _context.SupportTickets.CountAsync();
        var ticketNumber = $"T-{(ticketCount + 1):D4}";
        
        var ticket = new SupportTicket
        {
            Id = Guid.NewGuid(),
            TicketNumber = ticketNumber,
            UserId = userId,
            UserName = user.Email,
            UserType = user.Role,
            Subject = dto.Subject,
            Description = dto.Description,
            Priority = dto.Priority,
            Type = dto.Type,
            Status = "Open",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        
        _context.SupportTickets.Add(ticket);
        await _context.SaveChangesAsync();
        
        return MapToDto(ticket);
    }
    
    public async Task<PagedResult<SupportTicketDto>> GetMyTicketsAsync(
        Guid userId, string status, int page, int pageSize)
    {
        var query = _context.SupportTickets
            .Where(t => t.UserId == userId);
            
        if (!string.IsNullOrEmpty(status))
            query = query.Where(t => t.Status == status);
            
        var totalItems = await query.CountAsync();
        
        var tickets = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
            
        return new PagedResult<SupportTicketDto>
        {
            Items = tickets.Select(MapToDto).ToList(),
            Pagination = new PaginationMetadata
            {
                CurrentPage = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize)
            }
        };
    }
    
    public async Task<PagedResult<SupportTicketDto>> GetAllTicketsAsync(
        string status, string priority, string type, int page, int pageSize)
    {
        var query = _context.SupportTickets.AsQueryable();
        
        if (!string.IsNullOrEmpty(status))
            query = query.Where(t => t.Status == status);
        if (!string.IsNullOrEmpty(priority))
            query = query.Where(t => t.Priority == priority);
        if (!string.IsNullOrEmpty(type))
            query = query.Where(t => t.Type == type);
            
        var totalItems = await query.CountAsync();
        
        var tickets = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
            
        return new PagedResult<SupportTicketDto>
        {
            Items = tickets.Select(MapToDto).ToList(),
            Pagination = new PaginationMetadata
            {
                CurrentPage = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize)
            }
        };
    }
    
    public async Task<SupportTicketDto> GetTicketByIdAsync(Guid ticketId)
    {
        var ticket = await _context.SupportTickets.FindAsync(ticketId);
        if (ticket == null) throw new Exception("Ticket not found");
        return MapToDto(ticket);
    }
    
    public async Task<SupportTicketDto> UpdateTicketStatusAsync(Guid ticketId, string status)
    {
        var ticket = await _context.SupportTickets.FindAsync(ticketId);
        if (ticket == null) throw new Exception("Ticket not found");
        
        ticket.Status = status;
        ticket.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync();
        return MapToDto(ticket);
    }
    
    private SupportTicketDto MapToDto(SupportTicket ticket)
    {
        return new SupportTicketDto
        {
            Id = ticket.Id,
            TicketNumber = ticket.TicketNumber,
            Subject = ticket.Subject,
            Description = ticket.Description,
            Priority = ticket.Priority,
            Type = ticket.Type,
            Status = ticket.Status,
            UserName = ticket.UserName,
            UserType = ticket.UserType,
            CreatedAt = ticket.CreatedAt,
            UpdatedAt = ticket.UpdatedAt
        };
    }
}
```

### 5. Controller

```csharp
// Controllers/SupportController.cs
[ApiController]
[Route("api/v1/support")]
[Authorize]
public class SupportController : ControllerBase
{
    private readonly ISupportTicketService _supportService;
    
    public SupportController(ISupportTicketService supportService)
    {
        _supportService = supportService;
    }
    
    [HttpPost("tickets")]
    public async Task<IActionResult> CreateTicket([FromBody] CreateSupportTicketDto dto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        var ticket = await _supportService.CreateTicketAsync(userId, dto);
        
        return Ok(new ApiResponse<SupportTicketDto>
        {
            Success = true,
            Data = ticket,
            Message = "Support ticket created successfully"
        });
    }
    
    [HttpGet("my-tickets")]
    public async Task<IActionResult> GetMyTickets(
        [FromQuery] string status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        var result = await _supportService.GetMyTicketsAsync(userId, status, page, pageSize);
        
        return Ok(new ApiResponse<PagedResult<SupportTicketDto>>
        {
            Success = true,
            Data = result
        });
    }
    
    [HttpGet("tickets/{id}")]
    public async Task<IActionResult> GetTicketById(Guid id)
    {
        var ticket = await _supportService.GetTicketByIdAsync(id);
        
        return Ok(new ApiResponse<SupportTicketDto>
        {
            Success = true,
            Data = ticket
        });
    }
}
```

### 6. Update AdminController

Add this method to your existing `AdminController.cs`:

```csharp
// Already exists in AdminController, just verify it's there
[HttpGet("support-tickets")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> GetSupportTickets(
    [FromQuery] string status,
    [FromQuery] string priority,
    [FromQuery] string type,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 20)
{
    var result = await _supportService.GetAllTicketsAsync(status, priority, type, page, pageSize);
    
    return Ok(new ApiResponse<PagedResult<SupportTicketDto>>
    {
        Success = true,
        Data = result
    });
}

[HttpPut("support-tickets/{ticketId}/status")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> UpdateTicketStatus(Guid ticketId, [FromBody] string status)
{
    var ticket = await _supportService.UpdateTicketStatusAsync(ticketId, status);
    
    return Ok(new ApiResponse<SupportTicketDto>
    {
        Success = true,
        Data = ticket,
        Message = "Ticket status updated successfully"
    });
}
```

### 7. Register Service in Program.cs

```csharp
// Add this line in Program.cs
builder.Services.AddScoped<ISupportTicketService, SupportTicketService>();
```

### 8. Add DbSet to ApplicationDbContext

```csharp
public class ApplicationDbContext : DbContext
{
    // ... existing DbSets
    public DbSet<SupportTicket> SupportTickets { get; set; }
}
```

### 9. Create Migration

```bash
dotnet ef migrations add AddSupportTickets
dotnet ef database update
```

## 📊 API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/support/tickets` | User | Create ticket |
| GET | `/api/v1/support/my-tickets` | User | Get my tickets |
| GET | `/api/v1/support/tickets/{id}` | User | Get ticket details |
| GET | `/api/v1/admin/support-tickets` | Admin | Get all tickets |
| PUT | `/api/v1/admin/support-tickets/{id}/status` | Admin | Update status |

## 🧪 Testing

### Create Ticket (Candidate/Company)
```bash
POST http://localhost:5113/api/v1/support/tickets
Authorization: Bearer {token}
Content-Type: application/json

{
  "subject": "Login Issue",
  "description": "Cannot login to my account",
  "priority": "High",
  "type": "Technical"
}
```

### Get My Tickets
```bash
GET http://localhost:5113/api/v1/support/my-tickets?page=1&pageSize=20
Authorization: Bearer {token}
```

### Get All Tickets (Admin)
```bash
GET http://localhost:5113/api/v1/admin/support-tickets?status=Open&page=1&pageSize=20
Authorization: Bearer {admin-token}
```

## ✅ Implementation Checklist

- [ ] Create `SupportTicket` entity
- [ ] Create DTOs (`CreateSupportTicketDto`, `SupportTicketDto`, `UpdateTicketStatusDto`)
- [ ] Create `ISupportTicketService` interface
- [ ] Implement `SupportTicketService`
- [ ] Create `SupportController`
- [ ] Update `AdminController` (if not already done)
- [ ] Add `DbSet<SupportTicket>` to `ApplicationDbContext`
- [ ] Register service in `Program.cs`
- [ ] Create and run migration
- [ ] Test all endpoints

## 🎯 Priority

**HIGH** - The frontend is fully implemented and ready. Once you implement these backend endpoints, the support ticket system will work immediately!
