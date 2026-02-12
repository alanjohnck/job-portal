using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JobPortalApi.DTOs;
using JobPortalApi.Services;

namespace JobPortalApi.Controllers;

[ApiController]
[Route("api/v1/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardStats()
    {
        var result = await _adminService.GetDashboardStatsAsync();
        return Ok(result);
    }

    [HttpGet("activity")]
    public async Task<IActionResult> GetRecentActivity([FromQuery] int limit = 20)
    {
        var result = await _adminService.GetRecentActivityAsync(limit);
        return Ok(result);
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers(
        [FromQuery] string? role,
        [FromQuery] string? status,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await _adminService.GetAllUsersAsync(role, status, search, page, pageSize);
        return Ok(result);
    }

    [HttpPut("users/{userId}/status")]
    public async Task<IActionResult> ToggleUserStatus(Guid userId, [FromBody] bool isActive)
    {
        var result = await _adminService.ToggleUserStatusAsync(userId, isActive);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpDelete("jobs/{jobId}")]
    public async Task<IActionResult> DeleteJob(Guid jobId)
    {
        var result = await _adminService.DeleteJobAsync(jobId);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpGet("support-tickets")]
    public async Task<IActionResult> GetSupportTickets(
        [FromQuery] string? status,
        [FromQuery] string? priority,
        [FromQuery] string? type,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await _adminService.GetSupportTicketsAsync(status, priority, type, page, pageSize);
        return Ok(result);
    }

    [HttpPut("support-tickets/{ticketId}/status")]
    public async Task<IActionResult> UpdateTicketStatus(Guid ticketId, [FromBody] string status)
    {
        var result = await _adminService.UpdateTicketStatusAsync(ticketId, status);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }
}
