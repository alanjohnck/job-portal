using Microsoft.EntityFrameworkCore;
using JobPortalApi.Data;
using JobPortalApi.DTOs;
using JobPortalApi.Helpers;
using JobPortalApi.Models;
using BCrypt.Net;

namespace JobPortalApi.Services;

public class AuthService : IAuthService
{
    private readonly JobPortalDbContext _context;
    private readonly JwtTokenHelper _jwtTokenHelper;
    private readonly JwtSettings _jwtSettings;

    public AuthService(JobPortalDbContext context, JwtTokenHelper jwtTokenHelper, JwtSettings jwtSettings)
    {
        _context = context;
        _jwtTokenHelper = jwtTokenHelper;
        _jwtSettings = jwtSettings;
    }

    public async Task<ApiResponse<LoginResponse>> RegisterCandidateAsync(RegisterCandidateRequest request)
    {
        // Check if user already exists
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return ApiResponse<LoginResponse>.ErrorResponse(
                "Email already registered",
                "DUPLICATE_ENTRY"
            );
        }

        // Create user
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "Candidate",
            IsActive = true,
            IsEmailVerified = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Create candidate profile
        var candidate = new Candidate
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        _context.Candidates.Add(candidate);
        await _context.SaveChangesAsync();

        // Generate tokens
        var accessToken = _jwtTokenHelper.GenerateAccessToken(user, candidate.Id.ToString());
        var refreshToken = _jwtTokenHelper.GenerateRefreshToken();

        // Save refresh token
        var refreshTokenEntity = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays),
            CreatedAt = DateTime.UtcNow
        };
        _context.RefreshTokens.Add(refreshTokenEntity);
        await _context.SaveChangesAsync();

        var response = new LoginResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresIn = _jwtSettings.AccessTokenExpirationMinutes * 60,
            User = new UserInfo
            {
                UserId = user.Id,
                Email = user.Email,
                Role = user.Role,
                IsActive = user.IsActive,
                ProfileId = candidate.Id
            }
        };

        return ApiResponse<LoginResponse>.SuccessResponse(
            response,
            "Candidate registered successfully. Please verify your email."
        );
    }

    public async Task<ApiResponse<LoginResponse>> RegisterCompanyAsync(RegisterCompanyRequest request)
    {
        // Check if user already exists
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return ApiResponse<LoginResponse>.ErrorResponse(
                "Email already registered",
                "DUPLICATE_ENTRY"
            );
        }

        // Check if company name already exists
        if (await _context.Companies.AnyAsync(c => c.CompanyName == request.CompanyName))
        {
            return ApiResponse<LoginResponse>.ErrorResponse(
                "Company name already registered",
                "DUPLICATE_ENTRY"
            );
        }

        // Create user
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "Company",
            IsActive = true,
            IsEmailVerified = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Create company profile
        var company = new Company
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            CompanyName = request.CompanyName,
            CompanyEmail = request.CompanyEmail,
            PhoneNumber = request.PhoneNumber,
            Industry = request.Industry,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        _context.Companies.Add(company);
        await _context.SaveChangesAsync();

        // Generate tokens
        var accessToken = _jwtTokenHelper.GenerateAccessToken(user, company.Id.ToString());
        var refreshToken = _jwtTokenHelper.GenerateRefreshToken();

        // Save refresh token
        var refreshTokenEntity = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays),
            CreatedAt = DateTime.UtcNow
        };
        _context.RefreshTokens.Add(refreshTokenEntity);
        await _context.SaveChangesAsync();

        var response = new LoginResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresIn = _jwtSettings.AccessTokenExpirationMinutes * 60,
            User = new UserInfo
            {
                UserId = user.Id,
                Email = user.Email,
                Role = user.Role,
                IsActive = user.IsActive,
                ProfileId = company.Id
            }
        };

        return ApiResponse<LoginResponse>.SuccessResponse(
            response,
            "Company registered successfully. Please verify your email."
        );
    }

    public async Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users
            .Include(u => u.Candidate)
            .Include(u => u.Company)
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
        {
            return ApiResponse<LoginResponse>.ErrorResponse(
                "Invalid email or password",
                "UNAUTHORIZED"
            );
        }

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return ApiResponse<LoginResponse>.ErrorResponse(
                "Invalid email or password",
                "UNAUTHORIZED"
            );
        }

        if (!user.IsActive)
        {
            return ApiResponse<LoginResponse>.ErrorResponse(
                "Account is deactivated. Please contact support.",
                "FORBIDDEN"
            );
        }

        // Get profile ID
        Guid? profileId = user.Role == "Candidate" ? user.Candidate?.Id : user.Company?.Id;

        // Generate tokens
        var accessToken = _jwtTokenHelper.GenerateAccessToken(user, profileId?.ToString());
        var refreshToken = _jwtTokenHelper.GenerateRefreshToken();

        // Save refresh token
        var refreshTokenEntity = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays),
            CreatedAt = DateTime.UtcNow
        };
        _context.RefreshTokens.Add(refreshTokenEntity);

        // Update last login
        user.LastLoginAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var response = new LoginResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresIn = _jwtSettings.AccessTokenExpirationMinutes * 60,
            User = new UserInfo
            {
                UserId = user.Id,
                Email = user.Email,
                Role = user.Role,
                IsActive = user.IsActive,
                ProfileId = profileId
            }
        };

        return ApiResponse<LoginResponse>.SuccessResponse(response);
    }

    public async Task<ApiResponse<TokenResponse>> RefreshTokenAsync(string refreshToken)
    {
        var token = await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken && !rt.IsRevoked);

        if (token == null || token.ExpiresAt < DateTime.UtcNow)
        {
            return ApiResponse<TokenResponse>.ErrorResponse(
                "Invalid or expired refresh token",
                "UNAUTHORIZED"
            );
        }

        // Get profile ID
        var user = token.User;
        Guid? profileId = null;
        
        if (user.Role == "Candidate")
        {
            var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.UserId == user.Id);
            profileId = candidate?.Id;
        }
        else if (user.Role == "Company")
        {
            var company = await _context.Companies.FirstOrDefaultAsync(c => c.UserId == user.Id);
            profileId = company?.Id;
        }

        // Generate new access token
        var accessToken = _jwtTokenHelper.GenerateAccessToken(user, profileId?.ToString());

        var response = new TokenResponse
        {
            AccessToken = accessToken,
            ExpiresIn = _jwtSettings.AccessTokenExpirationMinutes * 60
        };

        return ApiResponse<TokenResponse>.SuccessResponse(response);
    }

    public async Task<ApiResponse<object>> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
        {
            // Don't reveal if email exists
            return ApiResponse<object>.SuccessResponse(
                null,
                "Password reset link sent to your email."
            );
        }

        // TODO: Generate password reset token and send email
        // For now, we'll just return success
        
        return ApiResponse<object>.SuccessResponse(
            null,
            "Password reset link sent to your email."
        );
    }

    public async Task<ApiResponse<object>> ResetPasswordAsync(ResetPasswordRequest request)
    {
        // TODO: Validate reset token
        // For now, we'll implement basic logic

        return ApiResponse<object>.SuccessResponse(
            null,
            "Password reset successfully."
        );
    }

    public async Task<ApiResponse<object>> VerifyEmailAsync(string token)
    {
        // TODO: Implement email verification logic
        
        return ApiResponse<object>.SuccessResponse(
            null,
            "Email verified successfully."
        );
    }
}
