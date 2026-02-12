using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JobPortalApi.DTOs;
using JobPortalApi.Services;

namespace JobPortalApi.Controllers;

[ApiController]
[Route("api/v1/mock-tests")]
public class MockTestController : ControllerBase
{
    private readonly IMockTestService _mockTestService;

    public MockTestController(IMockTestService mockTestService)
    {
        _mockTestService = mockTestService;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            throw new UnauthorizedAccessException("User ID claim not found");
        
        return Guid.Parse(userIdClaim.Value);
    }

    [HttpPost]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> CreateMockTest([FromBody] CreateMockTestRequest request)
    {
        var userId = GetUserId();
        var result = await _mockTestService.CreateMockTestAsync(userId, request);
        return CreatedAtAction(nameof(GetMockTestDetails), new { id = result.Data?.Id }, result);
    }

    [HttpGet("company")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> GetCompanyMockTests([FromQuery] string? status, [FromQuery] Guid? jobId)
    {
        var userId = GetUserId();
        var result = await _mockTestService.GetCompanyMockTestsAsync(userId, status, jobId);
        return Ok(result);
    }
    
    [HttpGet("{id}")]
    [Authorize] // Both roles can view details? Or maybe restrict? Assuming both.
    public async Task<IActionResult> GetMockTestDetails(Guid id)
    {
        var result = await _mockTestService.GetMockTestDetailsAsync(id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> UpdateMockTest(Guid id, [FromBody] CreateMockTestRequest request)
    {
        var userId = GetUserId();
        var result = await _mockTestService.UpdateMockTestAsync(userId, id, request);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> DeleteMockTest(Guid id)
    {
        var userId = GetUserId();
        var result = await _mockTestService.DeleteMockTestAsync(userId, id);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpGet("{id}/results")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> GetTestResults(Guid id, [FromQuery] int topN = 50)
    {
        var userId = GetUserId();
        var result = await _mockTestService.GetTestResultsAsync(userId, id, topN);
        return Ok(result);
    }
    
    // Candidate Endpoints
    
    [HttpGet("available")]
    [Authorize(Roles = "Candidate")]
    public async Task<IActionResult> GetAvailableTests()
    {
        var userId = GetUserId();
        var result = await _mockTestService.GetAvailableMockTestsAsync(userId);
        return Ok(result);
    }
    
    [HttpPost("{id}/submit")]
    [Authorize(Roles = "Candidate")]
    public async Task<IActionResult> SubmitTest(Guid id, [FromBody] SubmitTestRequest request)
    {
        var userId = GetUserId();
        var result = await _mockTestService.SubmitTestResultAsync(userId, id, request.Score);
        return Ok(result);
    }

}
