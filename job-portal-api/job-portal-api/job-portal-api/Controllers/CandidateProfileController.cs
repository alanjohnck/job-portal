using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JobPortalApi.Services;
using JobPortalApi.DTOs;
using JobPortalApi.Helpers;
using System.Security.Claims;

namespace JobPortalApi.Controllers;

[ApiController]
[Route("api/v1/candidate/profile")]
[Authorize(Roles = "Candidate")]
public class CandidateProfileController : ControllerBase
{
    private readonly ICandidateProfileService _profileService;

    public CandidateProfileController(ICandidateProfileService profileService)
    {
        _profileService = profileService;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim!);
    }

    // Profile Endpoints
    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetUserId();
        var result = await _profileService.GetProfileAsync(userId);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpGet("{candidateId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPublicProfile(Guid candidateId)
    {
        var result = await _profileService.GetPublicProfileAsync(candidateId);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateCandidateProfileRequest request)
    {
        var userId = GetUserId();
        var result = await _profileService.UpdateProfileAsync(userId, request);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpPatch("picture")]
    public async Task<IActionResult> UpdateProfilePicture([FromBody] UpdateProfilePictureRequest request)
    {
        var userId = GetUserId();
        var result = await _profileService.UpdateProfilePictureAsync(userId, request.ProfilePicture);
        return result.Success ? Ok(result) : NotFound(result);
    }

    // Resume Endpoints
    [HttpPost("resume")]
    public async Task<IActionResult> UpdateResume([FromBody] UpdateResumeRequest request)
    {
        var userId = GetUserId();
        var result = await _profileService.UpdateResumeAsync(userId, request.ResumeUrl);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpDelete("resume")]
    public async Task<IActionResult> DeleteResume()
    {
        var userId = GetUserId();
        var result = await _profileService.DeleteResumeAsync(userId);
        return result.Success ? Ok(result) : NotFound(result);
    }

    // Work Experience Endpoints
    [HttpGet("experience")]
    public async Task<IActionResult> GetWorkExperiences()
    {
        var userId = GetUserId();
        var result = await _profileService.GetWorkExperiencesAsync(userId);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpPost("experience")]
    public async Task<IActionResult> CreateWorkExperience([FromBody] CreateWorkExperienceRequest request)
    {
        var userId = GetUserId();
        var result = await _profileService.CreateWorkExperienceAsync(userId, request);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpPut("experience/{experienceId}")]
    public async Task<IActionResult> UpdateWorkExperience(Guid experienceId, [FromBody] UpdateWorkExperienceRequest request)
    {
        var userId = GetUserId();
        var result = await _profileService.UpdateWorkExperienceAsync(userId, experienceId, request);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpDelete("experience/{experienceId}")]
    public async Task<IActionResult> DeleteWorkExperience(Guid experienceId)
    {
        var userId = GetUserId();
        var result = await _profileService.DeleteWorkExperienceAsync(userId, experienceId);
        return result.Success ? Ok(result) : NotFound(result);
    }

    // Education Endpoints
    [HttpGet("education")]
    public async Task<IActionResult> GetEducations()
    {
        var userId = GetUserId();
        var result = await _profileService.GetEducationsAsync(userId);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpPost("education")]
    public async Task<IActionResult> CreateEducation([FromBody] CreateEducationRequest request)
    {
        var userId = GetUserId();
        var result = await _profileService.CreateEducationAsync(userId, request);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpPut("education/{educationId}")]
    public async Task<IActionResult> UpdateEducation(Guid educationId, [FromBody] UpdateEducationRequest request)
    {
        var userId = GetUserId();
        var result = await _profileService.UpdateEducationAsync(userId, educationId, request);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpDelete("education/{educationId}")]
    public async Task<IActionResult> DeleteEducation(Guid educationId)
    {
        var userId = GetUserId();
var result = await _profileService.DeleteEducationAsync(userId, educationId);
        return result.Success ? Ok(result) : NotFound(result);
    }

    // Certification Endpoints
    [HttpGet("certifications")]
    public async Task<IActionResult> GetCertifications()
    {
        var userId = GetUserId();
        var result = await _profileService.GetCertificationsAsync(userId);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpPost("certifications")]
    public async Task<IActionResult> CreateCertification([FromBody] CreateCertificationRequest request)
    {
        var userId = GetUserId();
        var result = await _profileService.CreateCertificationAsync(userId, request);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpPut("certifications/{certificationId}")]
    public async Task<IActionResult> UpdateCertification(Guid certificationId, [FromBody] UpdateCertificationRequest request)
    {
        var userId = GetUserId();
        var result = await _profileService.UpdateCertificationAsync(userId, certificationId, request);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpDelete("certifications/{certificationId}")]
    public async Task<IActionResult> DeleteCertification(Guid certificationId)
    {
        var userId = GetUserId();
        var result = await _profileService.DeleteCertificationAsync(userId, certificationId);
        return result.Success ? Ok(result) : NotFound(result);
    }

    // Skills Endpoints
    [HttpPut("skills")]
    public async Task<IActionResult> UpdateSkills([FromBody] UpdateSkillsRequest request)
    {
        var userId = GetUserId();
        var result = await _profileService.UpdateSkillsAsync(userId, request.Skills);
        return result.Success ? Ok(result) : NotFound(result);
    }
}
