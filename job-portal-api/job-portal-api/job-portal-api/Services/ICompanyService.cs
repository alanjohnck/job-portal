using JobPortalApi.DTOs;
using JobPortalApi.Helpers;

namespace JobPortalApi.Services;

public interface ICompanyService
{
    Task<ApiResponse<CompanyProfileDto>> GetProfileAsync(Guid userId);
    Task<ApiResponse<CompanyProfileDto>> UpdateProfileAsync(Guid userId, UpdateCompanyProfileRequest request);
    Task<ApiResponse<object>> GetDashboardStatsAsync(Guid userId);
    Task<ApiResponse<JobDto>> CreateJobAsync(Guid userId, CreateJobRequest request);
    Task<ApiResponse<JobDto>> UpdateJobAsync(Guid userId, Guid jobId, CreateJobRequest request);
    Task<ApiResponse<object>> DeleteJobAsync(Guid userId, Guid jobId);
    Task<ApiResponse<PaginationResponse<JobDto>>> GetCompanyJobsAsync(Guid userId, string? status, int page, int pageSize);
    Task<ApiResponse<JobDto>> GetJobDetailsAsync(Guid jobId, Guid userId); // To update a job, you need details first
    Task<ApiResponse<PaginationResponse<JobApplicationDetailDto>>> GetJobApplicationsAsync(Guid userId, Guid jobId, string? status, int page, int pageSize);
    Task<ApiResponse<object>> UpdateApplicationStatusAsync(Guid userId, Guid applicationId, UpdateApplicationStatusRequest request);
    Task<ApiResponse<PaginationResponse<CandidateProfileDto>>> SearchCandidatesAsync(string? keyword, string? location, int? experienceYears, string? skills, int page, int pageSize);
    Task<ApiResponse<object>> SaveCandidateAsync(Guid userId, Guid candidateId, string? notes);
    Task<ApiResponse<List<SavedCandidateDto>>> GetSavedCandidatesAsync(Guid userId);
    Task<ApiResponse<object>> RemoveSavedCandidateAsync(Guid userId, Guid candidateId);
}
