using JobPortalApi.DTOs;
using JobPortalApi.Helpers;

namespace JobPortalApi.Services;

public interface IMockTestService
{
    Task<ApiResponse<MockTestDto>> CreateMockTestAsync(Guid userId, CreateMockTestRequest request);
    Task<ApiResponse<List<MockTestDto>>> GetCompanyMockTestsAsync(Guid userId, string? status, Guid? jobId);
    Task<ApiResponse<MockTestDto>> GetMockTestDetailsAsync(Guid mockTestId);
    Task<ApiResponse<List<TestResultDto>>> GetTestResultsAsync(Guid userId, Guid mockTestId, int topN = 50);
    Task<ApiResponse<MockTestDto>> UpdateMockTestAsync(Guid userId, Guid mockTestId, CreateMockTestRequest request);
    Task<ApiResponse<object>> DeleteMockTestAsync(Guid userId, Guid mockTestId);
    
    // Candidate methods
    Task<ApiResponse<List<TestAttemptDto>>> GetAvailableMockTestsAsync(Guid userId);
    Task<ApiResponse<TestResultDto>> SubmitTestResultAsync(Guid userId, Guid mockTestId, int score);
}
