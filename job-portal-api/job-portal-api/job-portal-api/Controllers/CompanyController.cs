using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JobPortalApi.DTOs;
using JobPortalApi.Services;

namespace JobPortalApi.Controllers;

[ApiController]
[Route("api/v1/companies")]
[Authorize(Roles = "Company")]
public class CompanyController : ControllerBase
{
    private readonly ICompanyService _companyService;

    public CompanyController(ICompanyService companyService)
    {
        _companyService = companyService;
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
        var result = await _companyService.GetProfileAsync(userId);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateCompanyProfileRequest request)
    {
        var userId = GetUserId();
        var result = await _companyService.UpdateProfileAsync(userId, request);
        if (!result.Success)
        {
            if (result.Error?.Code == "DUPLICATE_ENTRY") return Conflict(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardStats()
    {
        var userId = GetUserId();
        var result = await _companyService.GetDashboardStatsAsync(userId);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpPost("jobs")]
    public async Task<IActionResult> CreateJob([FromBody] CreateJobRequest request)
    {
        var userId = GetUserId();
        var result = await _companyService.CreateJobAsync(userId, request);
        return CreatedAtAction(nameof(GetJobDetails), new { jobId = result.Data?.Id }, result);
    }

    [HttpPut("jobs/{jobId}")]
    public async Task<IActionResult> UpdateJob(Guid jobId, [FromBody] CreateJobRequest request)
    {
        var userId = GetUserId();
        var result = await _companyService.UpdateJobAsync(userId, jobId, request);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("jobs/{jobId}")]
    public async Task<IActionResult> DeleteJob(Guid jobId)
    {
        var userId = GetUserId();
        var result = await _companyService.DeleteJobAsync(userId, jobId);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpGet("jobs")]
    public async Task<IActionResult> GetCompanyJobs([FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var userId = GetUserId();
        var result = await _companyService.GetCompanyJobsAsync(userId, status, page, pageSize);
        return Ok(result);
    }

    [HttpGet("jobs/{jobId}")]
    public async Task<IActionResult> GetJobDetails(Guid jobId)
    {
        var userId = GetUserId();
        var result = await _companyService.GetJobDetailsAsync(jobId, userId);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpGet("jobs/{jobId}/applications")]
    public async Task<IActionResult> GetJobApplications(Guid jobId, [FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var userId = GetUserId();
        var result = await _companyService.GetJobApplicationsAsync(userId, jobId, status, page, pageSize);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpPut("applications/{applicationId}/status")]
    public async Task<IActionResult> UpdateApplicationStatus(Guid applicationId, [FromBody] UpdateApplicationStatusRequest request)
    {
        var userId = GetUserId();
        var result = await _companyService.UpdateApplicationStatusAsync(userId, applicationId, request);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpGet("candidates/search")]
    public async Task<IActionResult> SearchCandidates(
        [FromQuery] string? keyword,
        [FromQuery] string? location,
        [FromQuery] int? experienceYears,
        [FromQuery] string? skills,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        // Note: userId is not used for search params but context is company role
        var result = await _companyService.SearchCandidatesAsync(keyword, location, experienceYears, skills, page, pageSize);
        return Ok(result);
    }

    [HttpPost("candidates/{candidateId}/save")]
    public async Task<IActionResult> SaveCandidate(Guid candidateId, [FromBody] string? notes)
    {
        var userId = GetUserId();
        var result = await _companyService.SaveCandidateAsync(userId, candidateId, notes);
        if (!result.Success)
        {
            if (result.Error?.Code == "DUPLICATE_ENTRY") return Conflict(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    [HttpGet("candidates/saved")]
    public async Task<IActionResult> GetSavedCandidates()
    {
        var userId = GetUserId();
        var result = await _companyService.GetSavedCandidatesAsync(userId);
        return Ok(result);
    }

    [HttpDelete("candidates/{candidateId}/save")]
    public async Task<IActionResult> RemoveSavedCandidate(Guid candidateId)
    {
        var userId = GetUserId();
        var result = await _companyService.RemoveSavedCandidateAsync(userId, candidateId);
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }
}
