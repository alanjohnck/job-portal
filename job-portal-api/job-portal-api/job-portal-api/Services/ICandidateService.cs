using JobPortalApi.DTOs;
using JobPortalApi.Helpers;

namespace JobPortalApi.Services;

public interface ICandidateService
{
    Task<ApiResponse<CandidateProfileDto>> GetProfileAsync(Guid userId);
    Task<ApiResponse<CandidateProfileDto>> UpdateProfileAsync(Guid userId, UpdateCandidateProfileRequest request);
    Task<ApiResponse<PaginationResponse<JobDto>>> SearchJobsAsync(string? keyword, string? location, string? jobType, string? experienceLevel, decimal? minSalary, decimal? maxSalary, string? category, bool? isRemote, int page, int pageSize);
    Task<ApiResponse<JobDto>> GetJobDetailsAsync(Guid jobId, Guid? userId);
    Task<ApiResponse<object>> ApplyForJobAsync(Guid userId, Guid jobId, ApplyForJobRequest request);
    Task<ApiResponse<PaginationResponse<JobApplicationDto>>> GetMyApplicationsAsync(Guid userId, string? status, int page, int pageSize);
    Task<ApiResponse<object>> SaveJobAsync(Guid userId, Guid jobId);
    Task<ApiResponse<object>> UnsaveJobAsync(Guid userId, Guid jobId);
    Task<ApiResponse<List<JobDto>>> GetSavedJobsAsync(Guid userId);
    Task<ApiResponse<PaginationResponse<CompanyListDto>>> SearchCompaniesAsync(string? keyword, string? industry, int page, int pageSize);
    Task<ApiResponse<CompanyProfileDto>> GetCompanyDetailsAsync(Guid companyId);
    Task<ApiResponse<PaginationResponse<JobDto>>> GetCompanyJobsAsync(Guid companyId, int page, int pageSize);
}
