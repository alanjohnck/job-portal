using Microsoft.EntityFrameworkCore;
using JobPortalApi.Data;
using JobPortalApi.DTOs;
using JobPortalApi.Helpers;
using JobPortalApi.Models;

namespace JobPortalApi.Services;

public class SupportService : ISupportService
{
    private readonly JobPortalDbContext _context;

    public SupportService(JobPortalDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<SupportTicketDto>> CreateTicketAsync(Guid userId, CreateSupportTicketRequest request)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return ApiResponse<SupportTicketDto>.ErrorResponse("User not found", "NOT_FOUND");

        var ticket = new SupportTicket
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            TicketNumber = Guid.NewGuid().ToString().Substring(0, 8).ToUpper(),
            Subject = request.Subject,
            Description = request.Description,
            Priority = request.Priority,
            Type = request.Type,
            Status = "Open",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            User = user 
        };

        _context.SupportTickets.Add(ticket);
        await _context.SaveChangesAsync();
        
        var dto = new SupportTicketDto
        {
            Id = ticket.Id,
            TicketNumber = ticket.TicketNumber,
            Subject = ticket.Subject,
            Description = ticket.Description,
            Priority = ticket.Priority,
            Type = ticket.Type,
            Status = ticket.Status,
            CreatedAt = ticket.CreatedAt,
            UpdatedAt = ticket.UpdatedAt,
            UserEmail = user.Email,
            UserRole = user.Role
        };

        return ApiResponse<SupportTicketDto>.SuccessResponse(dto);
    }

    public async Task<ApiResponse<List<SupportTicketDto>>> GetMyTicketsAsync(Guid userId, string? status)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return ApiResponse<List<SupportTicketDto>>.ErrorResponse("User not found", "NOT_FOUND");

        var query = _context.SupportTickets
            .Include(t => t.User) 
            .Where(t => t.UserId == userId);

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(t => t.Status == status);
        }

        var tickets = await query
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

        var dtos = tickets.Select(t => new SupportTicketDto
        {
            Id = t.Id,
            TicketNumber = t.TicketNumber,
            Subject = t.Subject,
            Description = t.Description,
            Priority = t.Priority,
            Type = t.Type,
            Status = t.Status,
            CreatedAt = t.CreatedAt,
            UpdatedAt = t.UpdatedAt,
            UserEmail = t.User.Email,
            UserRole = t.User.Role
        }).ToList();


        return ApiResponse<List<SupportTicketDto>>.SuccessResponse(dtos);
    }
}
