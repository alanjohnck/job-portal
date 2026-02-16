using Microsoft.EntityFrameworkCore;
using JobPortalApi.Data;
using JobPortalApi.DTOs;
using JobPortalApi.Helpers;
using JobPortalApi.Models;

namespace JobPortalApi.Services;

public class MockTestService : IMockTestService
{
    private readonly JobPortalDbContext _context;

    public MockTestService(JobPortalDbContext context)
    {
        _context = context;
    }

    private async Task<Company?> GetCompanyByUserIdAsync(Guid userId)
    {
        return await _context.Companies.FirstOrDefaultAsync(c => c.UserId == userId);
    }

    public async Task<ApiResponse<MockTestDto>> CreateMockTestAsync(Guid userId, CreateMockTestRequest request)
    {
        var company = await GetCompanyByUserIdAsync(userId);
        if (company == null)
            return ApiResponse<MockTestDto>.ErrorResponse("Company profile not found", "NOT_FOUND");

        // Validate JobId
        var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == request.JobId && j.CompanyId == company.Id);
        if (job == null)
            return ApiResponse<MockTestDto>.ErrorResponse("Job not found or access denied", "NOT_FOUND");

        var mockTest = new MockTest
        {
            Id = Guid.NewGuid(),
            CompanyId = company.Id,
            JobId = request.JobId,
            Title = request.Title,
            Description = request.Description,
            ScheduledDate = request.ScheduledDate,
            StartTime = TimeSpan.Parse(request.StartTime),
            DurationMinutes = request.DurationMinutes,
            PassingScore = request.PassingScore,
            Status = request.Status,
            TotalApplicants = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.MockTests.Add(mockTest);
        
        // Add Questions
        if (request.Questions != null && request.Questions.Any())
        {
            foreach (var qDto in request.Questions)
            {
                var question = new TestQuestion
                {
                    Id = Guid.NewGuid(),
                    MockTestId = mockTest.Id,
                    QuestionText = qDto.QuestionText,
                    Points = qDto.Points,
                    OrderNumber = qDto.OrderNumber,
                    CreatedAt = DateTime.UtcNow
                };
                
                _context.TestQuestions.Add(question);

                if (qDto.Options != null && qDto.Options.Any())
                {
                    foreach (var oDto in qDto.Options)
                    {
                        var option = new TestQuestionOption
                        {
                            Id = Guid.NewGuid(),
                            TestQuestionId = question.Id,
                            OptionText = oDto.OptionText,
                            OrderNumber = oDto.OrderNumber,
                            IsCorrect = oDto.IsCorrect ?? false
                        };
                        _context.TestQuestionOptions.Add(option);
                    }
                }
            }
        }

        await _context.SaveChangesAsync();

        return await GetMockTestDetailsAsync(mockTest.Id);
    }

    public async Task<ApiResponse<MockTestDto>> GetMockTestDetailsAsync(Guid mockTestId)
    {
        var mockTest = await _context.MockTests
            .Include(m => m.Company)
            .Include(m => m.Job)
            .Include(m => m.Questions)
            .ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(m => m.Id == mockTestId);

        if (mockTest == null)
            return ApiResponse<MockTestDto>.ErrorResponse("Mock test not found", "NOT_FOUND");

        var dto = new MockTestDto
        {
            Id = mockTest.Id,
            JobId = mockTest.JobId,
            JobTitle = mockTest.Job?.Title ?? "Unknown Job",
            Title = mockTest.Title,
            Description = mockTest.Description,
            ScheduledDate = mockTest.ScheduledDate,
            StartTime = mockTest.StartTime,
            DurationMinutes = mockTest.DurationMinutes,
            PassingScore = mockTest.PassingScore,
            Status = mockTest.Status,
            TotalApplicants = mockTest.TotalApplicants,
            Company = new CompanyBasicInfo
            {
                Id = mockTest.Company.Id,
                Name = mockTest.Company.CompanyName,
                Logo = mockTest.Company.Logo,
                Industry = mockTest.Company.Industry
            },
            Questions = mockTest.Questions.Select(q => new TestQuestionDto
            {
                Id = q.Id,
                QuestionText = q.QuestionText,
                Points = q.Points,
                OrderNumber = q.OrderNumber,
                Options = q.Options.Select(o => new TestQuestionOptionDto
                {
                    Id = o.Id,
                    OptionText = o.OptionText,
                    OrderNumber = o.OrderNumber,
                    IsCorrect = o.IsCorrect
                }).ToList()
            }).ToList()
        };

        return ApiResponse<MockTestDto>.SuccessResponse(dto);
    }

    public async Task<ApiResponse<List<MockTestDto>>> GetCompanyMockTestsAsync(Guid userId, string? status, Guid? jobId)
    {
        var company = await GetCompanyByUserIdAsync(userId);
        if (company == null)
            return ApiResponse<List<MockTestDto>>.ErrorResponse("Company profile not found", "NOT_FOUND");

        var query = _context.MockTests
            .Include(m => m.Job)
            .Where(m => m.CompanyId == company.Id);

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(m => m.Status == status);
        }

        if (jobId.HasValue)
        {
            query = query.Where(m => m.JobId == jobId);
        }

        var mockTests = await query
            .OrderByDescending(m => m.ScheduledDate)
            .ToListAsync();

        var dtos = mockTests.Select(m => new MockTestDto
        {
            Id = m.Id,
            JobId = m.JobId,
            JobTitle = m.Job?.Title ?? "Unknown Job",
            Title = m.Title,
            Description = m.Description,
            ScheduledDate = m.ScheduledDate,
            StartTime = m.StartTime,
            DurationMinutes = m.DurationMinutes,
            PassingScore = m.PassingScore,
            Status = m.Status,
            TotalApplicants = m.TotalApplicants,
            Company = new CompanyBasicInfo { Id = company.Id, Name = company.CompanyName }
        }).ToList();

        return ApiResponse<List<MockTestDto>>.SuccessResponse(dtos);
    }

    public async Task<ApiResponse<MockTestDto>> UpdateMockTestAsync(Guid userId, Guid mockTestId, CreateMockTestRequest request)
    {
        var company = await GetCompanyByUserIdAsync(userId);
        if (company == null)
            return ApiResponse<MockTestDto>.ErrorResponse("Company profile not found", "NOT_FOUND");

        var mockTest = await _context.MockTests.FirstOrDefaultAsync(m => m.Id == mockTestId && m.CompanyId == company.Id);
        if (mockTest == null)
            return ApiResponse<MockTestDto>.ErrorResponse("Mock test not found or access denied", "NOT_FOUND");

        mockTest.Title = request.Title;
        mockTest.Description = request.Description;
        mockTest.ScheduledDate = request.ScheduledDate;
        mockTest.StartTime = TimeSpan.Parse(request.StartTime);
        mockTest.DurationMinutes = request.DurationMinutes;
        mockTest.PassingScore = request.PassingScore;
        mockTest.Status = request.Status;
        mockTest.UpdatedAt = DateTime.UtcNow;

        _context.MockTests.Update(mockTest);
        await _context.SaveChangesAsync();

        return await GetMockTestDetailsAsync(mockTestId);
    }

    public async Task<ApiResponse<object>> DeleteMockTestAsync(Guid userId, Guid mockTestId)
    {
        var company = await GetCompanyByUserIdAsync(userId);
        if (company == null)
            return ApiResponse<object>.ErrorResponse("Company profile not found", "NOT_FOUND");

        var mockTest = await _context.MockTests.FirstOrDefaultAsync(m => m.Id == mockTestId && m.CompanyId == company.Id);
        if (mockTest == null)
            return ApiResponse<object>.ErrorResponse("Mock test not found or access denied", "NOT_FOUND");

        _context.MockTests.Remove(mockTest);
        await _context.SaveChangesAsync();

        return ApiResponse<object>.SuccessResponse(null, "Mock test deleted successfully");
    }

    public async Task<ApiResponse<List<TestResultDto>>> GetTestResultsAsync(Guid userId, Guid mockTestId, int topN = 50)
    {
        var company = await GetCompanyByUserIdAsync(userId);
        if (company == null)
            return ApiResponse<List<TestResultDto>>.ErrorResponse("Company profile not found", "NOT_FOUND");

        var mockTest = await _context.MockTests.FirstOrDefaultAsync(m => m.Id == mockTestId && m.CompanyId == company.Id);
        if (mockTest == null)
            return ApiResponse<List<TestResultDto>>.ErrorResponse("Mock test not found or access denied", "NOT_FOUND");

        var results = await _context.TestResults
            .Include(tr => tr.Candidate)
            .ThenInclude(c => c.User)
            .Where(tr => tr.MockTestId == mockTestId)
            .OrderByDescending(tr => tr.Score)
            .Take(topN)
            .ToListAsync();

        var dtos = results.Select(tr => new TestResultDto
        {
            Id = tr.Id,
            MockTestId = tr.MockTestId,
            Score = tr.Score,
            Rank = tr.Rank,
            HasPassed = tr.HasPassed,
            CompletedAt = tr.CompletedAt,
            Candidate = new CandidateProfileDto
            {
                Id = tr.Candidate.Id,
                FirstName = tr.Candidate.FirstName,
                LastName = tr.Candidate.LastName,
                Email = tr.Candidate.User.Email,
                ProfilePicture = tr.Candidate.ProfilePicture
            }
        }).ToList();

        return ApiResponse<List<TestResultDto>>.SuccessResponse(dtos);
    }

    // Candidate Methods can be implemented similarly
    // For brevity, using placeholders or basic logic
    public async Task<ApiResponse<List<TestAttemptDto>>> GetAvailableMockTestsAsync(Guid userId)
    {
        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.UserId == userId);
        if (candidate == null)
            return ApiResponse<List<TestAttemptDto>>.ErrorResponse("Candidate profile not found", "NOT_FOUND");

        // Get JobIds where candidate is shortlisted
        var shortlistedApplications = await _context.JobApplications
            .Where(a => a.CandidateId == candidate.Id && a.Status == "Shortlisted")
            .Select(a => new { a.JobId, a.Job.Title, a.Job.Company.CompanyName })
            .ToListAsync();
            
        var jobIds = shortlistedApplications.Select(app => app.JobId).ToList();

        // Return tests that are 'Scheduled' and associated with relevant jobs
        var tests = await _context.MockTests
            .Include(m => m.Company)
            .Include(m => m.Job)
            .Include(m => m.Questions)
            .Where(m => m.Status == "Scheduled" && jobIds.Contains(m.JobId))
            .OrderBy(m => m.ScheduledDate)
            .ToListAsync();
            
        var dtos = new List<TestAttemptDto>();
        
        foreach (var test in tests)
        {
            var existingResult = await _context.TestResults
                .FirstOrDefaultAsync(r => r.MockTestId == test.Id && r.CandidateId == candidate.Id);
                
            var status = existingResult != null ? existingResult.Status : "Not Started"; // "Not Started", "In Progress", "Completed"
            
            dtos.Add(new TestAttemptDto
            {
                // Result Id if exists, else empty or new guid logic handled by start test
                Id = existingResult?.Id ?? Guid.Empty, 
                TestId = test.Id,
                TestTitle = test.Title,
                JobTitle = test.Job?.Title ?? "Unknown Job",
                CompanyName = test.Company.CompanyName,
                ScheduledDate = test.ScheduledDate,
                StartTime = test.StartTime,
                DurationMinutes = test.DurationMinutes,
                Status = status,
                Score = existingResult?.Score,
                TotalPoints = existingResult?.TotalPoints ?? test.Questions.Sum(q => q.Points), // If not started, can calculate total points if questions loaded, but might be heavy. For now 0 or null.
                HasPassed = existingResult?.HasPassed,
                StartedAt = existingResult?.StartedAt,
                CompletedAt = existingResult?.CompletedAt
            });
        }

        return ApiResponse<List<TestAttemptDto>>.SuccessResponse(dtos);
    }
    
    public async Task<ApiResponse<TestResultDto>> SubmitTestResultAsync(Guid userId, Guid mockTestId, int score)
    {
        var candidate = await _context.Candidates
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (candidate == null)
            return ApiResponse<TestResultDto>.ErrorResponse("Candidate profile not found", "NOT_FOUND");
            
        var mockTest = await _context.MockTests
            .Include(m => m.Questions)
            .FirstOrDefaultAsync(m => m.Id == mockTestId);

        if (mockTest == null)
            return ApiResponse<TestResultDto>.ErrorResponse("Mock test not found", "NOT_FOUND");
            
        // Validate if candidate is eligible (Shortlisted for the job)
        var isEligible = await _context.JobApplications
            .AnyAsync(a => a.CandidateId == candidate.Id && a.JobId == mockTest.JobId && a.Status == "Shortlisted");
            
        if (!isEligible)
             return ApiResponse<TestResultDto>.ErrorResponse("You are not eligible to take this test. Status must be 'Shortlisted'.", "FORBIDDEN");

        // Check if already submitted or in progress
        var existingResult = await _context.TestResults
            .FirstOrDefaultAsync(r => r.MockTestId == mockTestId && r.CandidateId == candidate.Id);

        if (existingResult != null && existingResult.Status == "Completed")
             return ApiResponse<TestResultDto>.ErrorResponse("Test already submitted.", "CONFLICT");

        var totalPoints = mockTest.Questions.Sum(q => q.Points);
        var hasPassed = score >= mockTest.PassingScore;
        
        TestResult result;
        
        if (existingResult != null)
        {
            // Update existing result
            result = existingResult;
            result.Score = score;
            result.TotalPoints = totalPoints;
            result.HasPassed = hasPassed;
            result.Status = "Completed";
            result.CompletedAt = DateTime.UtcNow;
            
            _context.TestResults.Update(result);
        }
        else
        {
            // Create new result
            result = new TestResult
            {
                Id = Guid.NewGuid(),
                MockTestId = mockTestId,
                CandidateId = candidate.Id,
                Score = score,
                TotalPoints = totalPoints,
                Rank = 0, // Will be calculated below
                HasPassed = hasPassed,
                Status = "Completed",
                CompletedAt = DateTime.UtcNow
            };
            
            _context.TestResults.Add(result);
            mockTest.TotalApplicants++; // Increment applicant count only for new attempts
        }
        
        try
        {
            await _context.SaveChangesAsync();
            
            // Calculate Rank: Update ranks for all results of this test
            var allResults = await _context.TestResults
                .Where(r => r.MockTestId == mockTestId && r.Status == "Completed")
                .OrderByDescending(r => r.Score)
                .ToListAsync();

            int rank = 1;
            foreach (var r in allResults)
            {
                r.Rank = rank++;
            }
            await _context.SaveChangesAsync();
            
            // Refresh our result object with the new rank
            var currentResultWithRank = allResults.First(r => r.Id == result.Id);

            return ApiResponse<TestResultDto>.SuccessResponse(new TestResultDto
            {
                Id = result.Id,
                MockTestId = mockTestId,
                Score = score,
                Rank = currentResultWithRank.Rank,
                HasPassed = hasPassed,
                CompletedAt = result.CompletedAt,
                Candidate = new CandidateProfileDto
                {
                    Id = candidate.Id,
                    FirstName = candidate.FirstName,
                    LastName = candidate.LastName,
                    Email = candidate.User.Email,
                    ProfilePicture = candidate.ProfilePicture
                }
            });
        }
        catch (Exception ex)
        {
            var innerMessage = ex.InnerException?.Message ?? ex.Message;
            return ApiResponse<TestResultDto>.ErrorResponse($"Failed to save test result: {innerMessage}", "INTERNAL_ERROR");
        }
    }
}
