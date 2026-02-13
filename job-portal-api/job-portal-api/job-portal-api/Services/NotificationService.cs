using Microsoft.EntityFrameworkCore;
using JobPortalApi.Data;
using JobPortalApi.Models;
using JobPortalApi.DTOs;
using JobPortalApi.Helpers;

namespace JobPortalApi.Services;

public interface INotificationService
{
    Task<ApiResponse<List<NotificationDto>>> GetUserNotificationsAsync(Guid userId, bool unreadOnly = false);
    Task<ApiResponse<int>> GetUnreadCountAsync(Guid userId);
    Task<ApiResponse<NotificationDto>> MarkAsReadAsync(Guid userId, Guid notificationId);
    Task<ApiResponse<object>> MarkAllAsReadAsync(Guid userId);
    Task<ApiResponse<NotificationDto>> CreateNotificationAsync(Guid userId, string title, string message, string type, string? relatedEntityId = null, string? relatedEntityType = null);
}

public class NotificationService : INotificationService
{
    private readonly JobPortalDbContext _context;

    public NotificationService(JobPortalDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<NotificationDto>>> GetUserNotificationsAsync(Guid userId, bool unreadOnly = false)
    {
        var query = _context.Notifications
            .Where(n => n.UserId == userId);

        if (unreadOnly)
        {
            query = query.Where(n => !n.IsRead);
        }

        var notifications = await query
            .OrderByDescending(n => n.CreatedAt)
            .Take(50)
            .Select(n => new NotificationDto
            {
                Id = n.Id,
                Title = n.Title,
                Message = n.Message,
                Type = n.Type,
                RelatedEntityId = n.RelatedEntityId,
                RelatedEntityType = n.RelatedEntityType,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            })
            .ToListAsync();

        return ApiResponse<List<NotificationDto>>.SuccessResponse(notifications);
    }

    public async Task<ApiResponse<int>> GetUnreadCountAsync(Guid userId)
    {
        var count = await _context.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .CountAsync();

        return ApiResponse<int>.SuccessResponse(count);
    }

    public async Task<ApiResponse<NotificationDto>> MarkAsReadAsync(Guid userId, Guid notificationId)
    {
        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId);

        if (notification == null)
            return ApiResponse<NotificationDto>.ErrorResponse("Notification not found", "NOT_FOUND");

        notification.IsRead = true;
        await _context.SaveChangesAsync();

        var dto = new NotificationDto
        {
            Id = notification.Id,
            Title = notification.Title,
            Message = notification.Message,
            Type = notification.Type,
            RelatedEntityId = notification.RelatedEntityId,
            RelatedEntityType = notification.RelatedEntityType,
            IsRead = notification.IsRead,
            CreatedAt = notification.CreatedAt
        };

        return ApiResponse<NotificationDto>.SuccessResponse(dto);
    }

    public async Task<ApiResponse<object>> MarkAllAsReadAsync(Guid userId)
    {
        await _context.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ExecuteUpdateAsync(setters => setters.SetProperty(n => n.IsRead, true));

        return ApiResponse<object>.SuccessResponse(new { message = "All notifications marked as read" });
    }

    public async Task<ApiResponse<NotificationDto>> CreateNotificationAsync(
        Guid userId,
        string title,
        string message,
        string type,
        string? relatedEntityId = null,
        string? relatedEntityType = null)
    {
        var notification = new Notification
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = title,
            Message = message,
            Type = type,
            RelatedEntityId = relatedEntityId,
            RelatedEntityType = relatedEntityType,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();

        var dto = new NotificationDto
        {
            Id = notification.Id,
            Title = notification.Title,
            Message = notification.Message,
            Type = notification.Type,
            RelatedEntityId = notification.RelatedEntityId,
            RelatedEntityType = notification.RelatedEntityType,
            IsRead = notification.IsRead,
            CreatedAt = notification.CreatedAt
        };

        return ApiResponse<NotificationDto>.SuccessResponse(dto);
    }
}
