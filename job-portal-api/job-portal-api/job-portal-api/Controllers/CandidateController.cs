using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JobPortalApi.DTOs;
using JobPortalApi.Services;

namespace JobPortalApi.Controllers;

[ApiController]
[Route("api/v1/candidates")]
[Authorize(Roles = "Candidate")]
public class CandidateController : ControllerBase
{
    private readonly ICandidateService _candidateService;

    public CandidateController(ICandidateService candidateService)
    {
        _candidateService = candidateService;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            throw new UnauthorizedAccessException("User ID claim not found");
        
        return Guid.Parse(userIdClaim.Value);
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetUserId();
        var result = await _candidateService.GetProfileAsync(userId);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateCandidateProfileRequest request)
    {
        var userId = GetUserId();
        var result = await _candidateService.UpdateProfileAsync(userId, request);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("jobs/search")]
    [AllowAnonymous] 
    public async Task<IActionResult> SearchJobs(
        [FromQuery] string? keyword,
        [FromQuery] string? location,
        [FromQuery] string? jobType,
        [FromQuery] string? experienceLevel,
        [FromQuery] decimal? minSalary,
        [FromQuery] decimal? maxSalary,
        [FromQuery] string? category,
        [FromQuery] bool? isRemote,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await _candidateService.SearchJobsAsync(keyword, location, jobType, experienceLevel, minSalary, maxSalary, category, isRemote, page, pageSize);
        return Ok(result);
    }

    [HttpGet("jobs/{jobId}")]
    public async Task<IActionResult> GetJobDetails(Guid jobId)
    {
        var userId = GetUserId();
        var result = await _candidateService.GetJobDetailsAsync(jobId, userId);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpPost("jobs/{jobId}/apply")]
    public async Task<IActionResult> ApplyForJob(Guid jobId, [FromBody] ApplyForJobRequest request)
    {
        var userId = GetUserId();
        var result = await _candidateService.ApplyForJobAsync(userId, jobId, request);
        if (!result.Success)
        {
            if (result.Error?.Code == "DUPLICATE_ENTRY") return Conflict(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    [HttpGet("applications")]
    public async Task<IActionResult> GetMyApplications([FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var userId = GetUserId();
        var result = await _candidateService.GetMyApplicationsAsync(userId, status, page, pageSize);
        return Ok(result);
    }

    [HttpPost("jobs/{jobId}/save")]
    public async Task<IActionResult> SaveJob(Guid jobId)
    {
        var userId = GetUserId();
        var result = await _candidateService.SaveJobAsync(userId, jobId);
        if (!result.Success)
        {
            if (result.Error?.Code == "DUPLICATE_ENTRY") return Conflict(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    [HttpDelete("jobs/{jobId}/save")]
    public async Task<IActionResult> UnsaveJob(Guid jobId)
    {
        var userId = GetUserId();
        var result = await _candidateService.UnsaveJobAsync(userId, jobId);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpGet("jobs/saved")]
    public async Task<IActionResult> GetSavedJobs()
    {
        var userId = GetUserId();
        var result = await _candidateService.GetSavedJobsAsync(userId);
        return Ok(result);
    }
}
