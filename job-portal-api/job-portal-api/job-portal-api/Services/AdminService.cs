using Microsoft.EntityFrameworkCore;
using JobPortalApi.Data;
using JobPortalApi.DTOs;
using JobPortalApi.Helpers;
using JobPortalApi.Models;

namespace JobPortalApi.Services;

public class AdminService : IAdminService
{
    private readonly JobPortalDbContext _context;

    public AdminService(JobPortalDbContext context)
    {
        _context = context;
    }

    private async Task LogActionAsync(Guid adminId, string action, string targetType, Guid? targetId, string details = "")
    {
        var log = new AdminLog
        {
            Id = Guid.NewGuid(),
            AdminUserId = adminId,
            Action = action,
            TargetType = targetType,
            TargetId = targetId,
            Details = details,
            Timestamp = DateTime.UtcNow
        };
        _context.AdminLogs.Add(log);
        await _context.SaveChangesAsync();
    }

    public async Task<ApiResponse<AdminDashboardStats>> GetDashboardStatsAsync()
    {
        var totalUsers = await _context.Users.CountAsync();
        var totalCompanies = await _context.Companies.CountAsync();
        var totalCandidates = await _context.Candidates.CountAsync();
        var totalActiveJobs = await _context.Jobs.CountAsync(j => j.Status == "Active");
        var totalApplications = await _context.JobApplications.CountAsync();

        var stats = new AdminDashboardStats
        {
            TotalUsers = totalUsers,
            TotalCompanies = totalCompanies,
            TotalCandidates = totalCandidates,
            TotalActiveJobs = totalActiveJobs,
            TotalApplications = totalApplications,
            Revenue = totalCompanies * 0 // Placeholder logic
        };

        return ApiResponse<AdminDashboardStats>.SuccessResponse(stats);
    }

    public async Task<ApiResponse<List<ActivityDto>>> GetRecentActivityAsync(int limit = 20)
    {
        var logs = await _context.AdminLogs
            .Include(l => l.Admin)
            .OrderByDescending(l => l.Timestamp)
            .Take(limit)
            .ToListAsync();

        var dtos = logs.Select(l => new ActivityDto
        {
            Id = l.Id,
            Action = l.Action,
            Target = $"{l.TargetType} ({l.TargetId})", // Combine for display
            Timestamp = l.Timestamp,
            AdminEmail = l.Admin.Email
        }).ToList();

        return ApiResponse<List<ActivityDto>>.SuccessResponse(dtos);
    }

    public async Task<ApiResponse<PaginationResponse<UserDto>>> GetAllUsersAsync(string? role, string? status, string? search, int page, int pageSize)
    {
        var query = _context.Users.AsQueryable();

        if (!string.IsNullOrEmpty(role))
        {
            query = query.Where(u => u.Role == role);
        }

        if (!string.IsNullOrEmpty(status))
        {
            bool isActive = status.ToLower() == "active";
            query = query.Where(u => u.IsActive == isActive);
        }

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(u => u.Email.Contains(search));
        }

        var totalItems = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new
            {
                User = u,
                CandidateName = _context.Candidates.Where(c => c.UserId == u.Id).Select(c => c.FirstName + " " + c.LastName).FirstOrDefault(),
                CompanyName = _context.Companies.Where(c => c.UserId == u.Id).Select(c => c.CompanyName).FirstOrDefault()
            })
            .ToListAsync();

        var dtos = users.Select(x => new UserDto
        {
            Id = x.User.Id,
            Email = x.User.Email,
            FullName = x.User.Role == "Candidate" ? x.CandidateName : (x.User.Role == "Company" ? x.CompanyName : "Admin"),
            Role = x.User.Role,
            IsActive = x.User.IsActive,
            CreatedAt = x.User.CreatedAt,
            LastLoginAt = x.User.LastLoginAt
        }).ToList();

        return ApiResponse<PaginationResponse<UserDto>>.SuccessResponse(new PaginationResponse<UserDto>
        {
            Items = dtos,
            Pagination = new PaginationMetadata
            {
                CurrentPage = page,
                PageSize = pageSize,
                TotalPages = totalPages,
                TotalItems = totalItems,
                HasNextPage = page < totalPages,
                HasPreviousPage = page > 1
            }
        });
    }

    public async Task<ApiResponse<object>> ToggleUserStatusAsync(Guid userId, bool isActive)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return ApiResponse<object>.ErrorResponse("User not found", "NOT_FOUND");

        user.IsActive = isActive;
        user.UpdatedAt = DateTime.UtcNow;

        _context.Users.Update(user);
        await _context.SaveChangesAsync();
        
        // Log action would go here
        
        return ApiResponse<object>.SuccessResponse(null, $"User status updated to {(isActive ? "Active" : "Inactive")}");
    }

    public async Task<ApiResponse<object>> DeleteJobAsync(Guid jobId)
    {
        var job = await _context.Jobs.FindAsync(jobId);
        if (job == null)
            return ApiResponse<object>.ErrorResponse("Job not found", "NOT_FOUND");

        _context.Jobs.Remove(job);
        await _context.SaveChangesAsync();

        return ApiResponse<object>.SuccessResponse(null, "Job deleted successfully");
    }

    public async Task<ApiResponse<PaginationResponse<SupportTicketDto>>> GetSupportTicketsAsync(string? status, string? priority, string? type, int page, int pageSize)
    {
        var query = _context.SupportTickets
            .Include(t => t.User)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(t => t.Status == status);
        }

        if (!string.IsNullOrEmpty(priority))
        {
            query = query.Where(t => t.Priority == priority);
        }
        
        if (!string.IsNullOrEmpty(type))
        {
             // SupportTicket model has UserType, filtering by that if intended by 'type'
             query = query.Where(t => t.UserType == type);
        }

        var totalItems = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        var tickets = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var dtos = tickets.Select(t => new SupportTicketDto
        {
            Id = t.Id,
            TicketNumber = t.TicketNumber, // Changed to use actual property
            Subject = t.Subject,
            Description = t.Description,
            Priority = t.Priority,
            Status = t.Status,
            CreatedAt = t.CreatedAt,
            UpdatedAt = t.UpdatedAt,
            UserEmail = t.User.Email,
            UserRole = t.User.Role
        }).ToList();

        return ApiResponse<PaginationResponse<SupportTicketDto>>.SuccessResponse(new PaginationResponse<SupportTicketDto>
        {
            Items = dtos,
            Pagination = new PaginationMetadata
            {
                CurrentPage = page,
                PageSize = pageSize,
                TotalPages = totalPages,
                TotalItems = totalItems,
                HasNextPage = page < totalPages,
                HasPreviousPage = page > 1
            }
        });
    }

    public async Task<ApiResponse<object>> UpdateTicketStatusAsync(Guid ticketId, string status)
    {
        var ticket = await _context.SupportTickets.FindAsync(ticketId);
        if (ticket == null)
            return ApiResponse<object>.ErrorResponse("Support ticket not found", "NOT_FOUND");

        ticket.Status = status;
        ticket.UpdatedAt = DateTime.UtcNow;

        _context.SupportTickets.Update(ticket);
        await _context.SaveChangesAsync();

        return ApiResponse<object>.SuccessResponse(null, "Ticket status updated successfully");
    }
}
