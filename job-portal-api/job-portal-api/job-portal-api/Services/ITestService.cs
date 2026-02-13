using JobPortalApi.DTOs;

namespace JobPortalApi.Services;

public interface ITestService
{
    // Company Operations
    Task<TestDto> CreateTestAsync(Guid companyId, CreateTestRequestDto request);
    Task<TestQuestionDto> AddQuestionAsync(Guid testId, Guid companyId, AddQuestionRequestDto request);
    Task<TestDetailDto> GetTestByIdAsync(Guid testId, Guid companyId);
    Task<List<TestDto>> GetTestsByJobIdAsync(Guid jobId, Guid companyId);
    Task<List<TestResultSummaryDto>> GetTestResultsAsync(Guid testId, Guid companyId);
    Task<TestResultDetailDto> GetTestResultDetailAsync(Guid resultId, Guid companyId);
    Task<bool> DeleteTestAsync(Guid testId, Guid companyId);

    // Candidate Operations
    Task<List<TestAttemptDto>> GetAvailableTestsAsync(Guid candidateId);
    Task<TestDetailDto> GetTestForCandidateAsync(Guid testId, Guid candidateId);
    Task<TestResultSummaryDto> StartTestAsync(Guid testId, Guid candidateId);
    Task<TestResultDetailDto> SubmitTestAsync(Guid testId, Guid candidateId, SubmitTestRequestDto request);
    Task<TestResultDetailDto> GetMyTestResultAsync(Guid testId, Guid candidateId);
}
