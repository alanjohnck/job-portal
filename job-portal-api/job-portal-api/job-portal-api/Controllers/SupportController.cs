using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JobPortalApi.DTOs;
using JobPortalApi.Services;

namespace JobPortalApi.Controllers;

[ApiController]
[Route("api/v1/support-tickets")]
[Authorize]
public class SupportController : ControllerBase
{
    private readonly ISupportService _supportService;

    public SupportController(ISupportService supportService)
    {
        _supportService = supportService;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            throw new UnauthorizedAccessException("User ID claim not found");
        
        return Guid.Parse(userIdClaim.Value);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTicket([FromBody] CreateSupportTicketRequest request)
    {
        var userId = GetUserId();
        var result = await _supportService.CreateTicketAsync(userId, request);
        return CreatedAtAction(nameof(GetMyTickets), new { id = result.Data?.Id }, result);
    }

    [HttpGet] // Returns my tickets
    public async Task<IActionResult> GetMyTickets([FromQuery] string? status)
    {
        var userId = GetUserId();
        var result = await _supportService.GetMyTicketsAsync(userId, status);
        return Ok(result);
    }
}
