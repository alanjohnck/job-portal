using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JobPortalApi.Services;
using JobPortalApi.DTOs;
using JobPortalApi.Helpers;
using System.Security.Claims;

namespace JobPortalApi.Controllers;

[ApiController]
[Route("api/v1/notifications")]
[Authorize]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim!);
    }

    [HttpGet]
    public async Task<IActionResult> GetNotifications([FromQuery] bool unreadOnly = false)
    {
        var userId = GetUserId();
        var result = await _notificationService.GetUserNotificationsAsync(userId, unreadOnly);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        var userId = GetUserId();
        var result = await _notificationService.GetUnreadCountAsync(userId);
        return Ok(result);
    }

    [HttpPatch("{notificationId}/read")]
    public async Task<IActionResult> MarkAsRead(Guid notificationId)
    {
        var userId = GetUserId();
        var result = await _notificationService.MarkAsReadAsync(userId, notificationId);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpPatch("mark-all-read")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var userId = GetUserId();
        var result = await _notificationService.MarkAllAsReadAsync(userId);
        return Ok(result);
    }
}
