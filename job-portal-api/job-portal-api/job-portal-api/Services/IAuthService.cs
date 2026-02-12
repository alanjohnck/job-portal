using JobPortalApi.DTOs;
using JobPortalApi.Helpers;


namespace JobPortalApi.Services;

public interface IAuthService
{
    Task<ApiResponse<LoginResponse>> RegisterCandidateAsync(RegisterCandidateRequest request);
    Task<ApiResponse<LoginResponse>> RegisterCompanyAsync(RegisterCompanyRequest request);
    Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request);
    Task<ApiResponse<TokenResponse>> RefreshTokenAsync(string refreshToken);
    Task<ApiResponse<object>> ForgotPasswordAsync(ForgotPasswordRequest request);
    Task<ApiResponse<object>> ResetPasswordAsync(ResetPasswordRequest request);
    Task<ApiResponse<object>> VerifyEmailAsync(string token);
}

public class TokenResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public int ExpiresIn { get; set; }
}
