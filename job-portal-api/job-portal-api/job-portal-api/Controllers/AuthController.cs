using Microsoft.AspNetCore.Mvc;
using JobPortalApi.DTOs;
using JobPortalApi.Services;

namespace JobPortalApi.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Register a new candidate
    /// </summary>
    [HttpPost("register/candidate")]
    public async Task<IActionResult> RegisterCandidate([FromBody] RegisterCandidateRequest request)
    {
        var result = await _authService.RegisterCandidateAsync(request);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return CreatedAtAction(nameof(RegisterCandidate), result);
    }

    /// <summary>
    /// Register a new company
    /// </summary>
    [HttpPost("register/company")]
    public async Task<IActionResult> RegisterCompany([FromBody] RegisterCompanyRequest request)
    {
        var result = await _authService.RegisterCompanyAsync(request);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return CreatedAtAction(nameof(RegisterCompany), result);
    }

    /// <summary>
    /// Login with email and password
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);
        
        if (!result.Success)
        {
            return Unauthorized(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Refresh access token using refresh token
    /// </summary>
    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        var result = await _authService.RefreshTokenAsync(request.RefreshToken);
        
        if (!result.Success)
        {
            return Unauthorized(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Request password reset link
    /// </summary>
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var result = await _authService.ForgotPasswordAsync(request);
        return Ok(result);
    }

    /// <summary>
    /// Reset password with token
    /// </summary>
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var result = await _authService.ResetPasswordAsync(request);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Verify email address
    /// </summary>
    [HttpGet("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromQuery] string token)
    {
        var result = await _authService.VerifyEmailAsync(token);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
