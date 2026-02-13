using JobPortalApi.Data;
using JobPortalApi.DTOs;
using JobPortalApi.Models;
using Microsoft.EntityFrameworkCore;

namespace JobPortalApi.Services;

public class TestService : ITestService
{
    private readonly JobPortalDbContext _context;

    public TestService(JobPortalDbContext context)
    {
        _context = context;
    }

    // Company Operations

    public async Task<TestDto> CreateTestAsync(Guid companyId, CreateTestRequestDto request)
    {
        // Verify job belongs to company
        var job = await _context.Jobs
            .FirstOrDefaultAsync(j => j.Id == request.JobId && j.CompanyId == companyId);
        
        if (job == null)
            throw new UnauthorizedAccessException("Job not found or doesn't belong to this company");

        var test = new MockTest
        {
            Id = Guid.NewGuid(),
            JobId = request.JobId,
            CompanyId = companyId,
            Title = request.Title,
            Description = request.Description,
            ScheduledDate = request.ScheduledDate,
            StartTime = request.StartTime,
            DurationMinutes = request.DurationMinutes,
            PassingScore = request.PassingScore,
            Status = "Scheduled",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.MockTests.Add(test);
        await _context.SaveChangesAsync();

        return new TestDto
        {
            Id = test.Id,
            JobId = test.JobId,
            JobTitle = job.Title,
            Title = test.Title,
            Description = test.Description,
            ScheduledDate = test.ScheduledDate,
            StartTime = test.StartTime,
            DurationMinutes = test.DurationMinutes,
            PassingScore = test.PassingScore,
            Status = test.Status,
            TotalQuestions = 0,
            TotalApplicants = test.TotalApplicants,
            CreatedAt = test.CreatedAt
        };
    }

    public async Task<TestQuestionDto> AddQuestionAsync(Guid testId, Guid companyId, AddQuestionRequestDto request)
    {
        // Verify test belongs to company
        var test = await _context.MockTests
            .FirstOrDefaultAsync(t => t.Id == testId && t.CompanyId == companyId);
        
        if (test == null)
            throw new UnauthorizedAccessException("Test not found or doesn't belong to this company");

        // Validate at least one correct answer
        if (!request.Options.Any(o => o.IsCorrect))
            throw new InvalidOperationException("At least one option must be marked as correct");

        var question = new TestQuestion
        {
            Id = Guid.NewGuid(),
            MockTestId = testId,
            QuestionText = request.QuestionText,
            OrderNumber = request.OrderNumber,
            Points = request.Points,
            CreatedAt = DateTime.UtcNow
        };

        _context.TestQuestions.Add(question);

        var options = request.Options.Select(o => new TestQuestionOption
        {
            Id = Guid.NewGuid(),
            TestQuestionId = question.Id,
            OptionText = o.OptionText,
            OrderNumber = o.OrderNumber,
            IsCorrect = o.IsCorrect
        }).ToList();

        _context.TestQuestionOptions.AddRange(options);
        await _context.SaveChangesAsync();

        return new TestQuestionDto
        {
            Id = question.Id,
            QuestionText = question.QuestionText,
            OrderNumber = question.OrderNumber,
            Points = question.Points,
            Options = options.Select(o => new TestOptionDto
            {
                Id = o.Id,
                OptionText = o.OptionText,
                OrderNumber = o.OrderNumber,
                IsCorrect = o.IsCorrect
            }).ToList()
        };
    }

    public async Task<TestDetailDto> GetTestByIdAsync(Guid testId, Guid companyId)
    {
        var test = await _context.MockTests
            .Include(t => t.Job)
            .Include(t => t.Questions.OrderBy(q => q.OrderNumber))
                .ThenInclude(q => q.Options.OrderBy(o => o.OrderNumber))
            .FirstOrDefaultAsync(t => t.Id == testId && t.CompanyId == companyId);

        if (test == null)
            throw new KeyNotFoundException("Test not found");

        return new TestDetailDto
        {
            Id = test.Id,
            JobId = test.JobId,
            JobTitle = test.Job.Title,
            Title = test.Title,
            Description = test.Description,
            ScheduledDate = test.ScheduledDate,
            StartTime = test.StartTime,
            DurationMinutes = test.DurationMinutes,
            PassingScore = test.PassingScore,
            Status = test.Status,
            Questions = test.Questions.Select(q => new TestQuestionDto
            {
                Id = q.Id,
                QuestionText = q.QuestionText,
                OrderNumber = q.OrderNumber,
                Points = q.Points,
                Options = q.Options.Select(o => new TestOptionDto
                {
                    Id = o.Id,
                    OptionText = o.OptionText,
                    OrderNumber = o.OrderNumber,
                    IsCorrect = o.IsCorrect
                }).ToList()
            }).ToList(),
            CreatedAt = test.CreatedAt
        };
    }

    public async Task<List<TestDto>> GetTestsByJobIdAsync(Guid jobId, Guid companyId)
    {
        var tests = await _context.MockTests
            .Include(t => t.Job)
            .Include(t => t.Questions)
            .Where(t => t.JobId == jobId && t.CompanyId == companyId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

        return tests.Select(t => new TestDto
        {
            Id = t.Id,
            JobId = t.JobId,
            JobTitle = t.Job.Title,
            Title = t.Title,
            Description = t.Description,
            ScheduledDate = t.ScheduledDate,
            StartTime = t.StartTime,
            DurationMinutes = t.DurationMinutes,
            PassingScore = t.PassingScore,
            Status = t.Status,
            TotalQuestions = t.Questions.Count,
            TotalApplicants = t.TotalApplicants,
            CreatedAt = t.CreatedAt
        }).ToList();
    }

    public async Task<List<TestResultSummaryDto>> GetTestResultsAsync(Guid testId, Guid companyId)
    {
        // Verify test belongs to company
        var test = await _context.MockTests
            .FirstOrDefaultAsync(t => t.Id == testId && t.CompanyId == companyId);
        
        if (test == null)
            throw new UnauthorizedAccessException("Test not found or doesn't belong to this company");

        var results = await _context.TestResults
            .Include(r => r.Candidate)
                .ThenInclude(c => c.User)
            .Where(r => r.MockTestId == testId && r.Status == "Completed")
            .OrderByDescending(r => r.Score)
            .ToListAsync();

        // Calculate ranks
        var rankedResults = results.Select((r, index) => new TestResultSummaryDto
        {
            Id = r.Id,
            CandidateId = r.CandidateId,
            CandidateName = $"{r.Candidate.FirstName} {r.Candidate.LastName}",
            CandidateEmail = r.Candidate.User.Email,
            Score = r.Score,
            TotalPoints = r.TotalPoints,
            Percentage = r.TotalPoints > 0 ? Math.Round((double)r.Score / r.TotalPoints * 100, 2) : 0,
            Rank = index + 1,
            HasPassed = r.HasPassed,
            CompletedAt = r.CompletedAt,
            Status = r.Status
        }).ToList();

        // Update ranks in database
        foreach (var result in results)
        {
            var rankedResult = rankedResults.First(r => r.Id == result.Id);
            result.Rank = rankedResult.Rank;
        }
        await _context.SaveChangesAsync();

        return rankedResults;
    }

    public async Task<TestResultDetailDto> GetTestResultDetailAsync(Guid resultId, Guid companyId)
    {
        var result = await _context.TestResults
            .Include(r => r.MockTest)
            .Include(r => r.Candidate)
                .ThenInclude(c => c.User)
            .Include(r => r.Answers)
                .ThenInclude(a => a.TestQuestion)
                    .ThenInclude(q => q.Options)
            .Include(r => r.Answers)
                .ThenInclude(a => a.SelectedOption)
            .FirstOrDefaultAsync(r => r.Id == resultId && r.MockTest.CompanyId == companyId);

        if (result == null)
            throw new KeyNotFoundException("Test result not found");

        return new TestResultDetailDto
        {
            Id = result.Id,
            CandidateId = result.CandidateId,
            CandidateName = $"{result.Candidate.FirstName} {result.Candidate.LastName}",
            CandidateEmail = result.Candidate.User.Email,
            Score = result.Score,
            TotalPoints = result.TotalPoints,
            Percentage = result.TotalPoints > 0 ? Math.Round((double)result.Score / result.TotalPoints * 100, 2) : 0,
            Rank = result.Rank,
            HasPassed = result.HasPassed,
            StartedAt = result.StartedAt,
            CompletedAt = result.CompletedAt,
            Status = result.Status,
            Answers = result.Answers.Select(a =>
            {
                var correctOption = a.TestQuestion.Options.FirstOrDefault(o => o.IsCorrect);
                return new TestAnswerDetailDto
                {
                    QuestionId = a.TestQuestionId,
                    QuestionText = a.TestQuestion.QuestionText,
                    Points = a.TestQuestion.Points,
                    SelectedOptionId = a.SelectedOptionId,
                    SelectedOptionText = a.SelectedOption.OptionText,
                    IsCorrect = a.IsCorrect,
                    CorrectOptionId = correctOption?.Id,
                    CorrectOptionText = correctOption?.OptionText
                };
            }).ToList()
        };
    }

    public async Task<bool> DeleteTestAsync(Guid testId, Guid companyId)
    {
        var test = await _context.MockTests
            .FirstOrDefaultAsync(t => t.Id == testId && t.CompanyId == companyId);
        
        if (test == null)
            return false;

        _context.MockTests.Remove(test);
        await _context.SaveChangesAsync();
        return true;
    }

    // Candidate Operations

    public async Task<List<TestAttemptDto>> GetAvailableTestsAsync(Guid candidateId)
    {
        // Get all jobs where candidate has "Shortlisted" status
        var shortlistedApplications = await _context.JobApplications
            .Include(a => a.Job)
                .ThenInclude(j => j.Company)
            .Include(a => a.Job.MockTests)
            .Where(a => a.CandidateId == candidateId && a.Status == "Shortlisted")
            .ToListAsync();

        var availableTests = new List<TestAttemptDto>();

        foreach (var application in shortlistedApplications)
        {
            foreach (var test in application.Job.MockTests)
            {
                // Check if candidate already has an attempt
                var existingResult = await _context.TestResults
                    .FirstOrDefaultAsync(r => r.MockTestId == test.Id && r.CandidateId == candidateId);

                var status = existingResult == null ? "Not Started" : existingResult.Status;
                
                availableTests.Add(new TestAttemptDto
                {
                    Id = existingResult?.Id ?? Guid.Empty,
                    TestId = test.Id,
                    TestTitle = test.Title,
                    JobTitle = application.Job.Title,
                    CompanyName = application.Job.Company.CompanyName,
                    ScheduledDate = test.ScheduledDate,
                    StartTime = test.StartTime,
                    DurationMinutes = test.DurationMinutes,
                    Status = status,
                    Score = existingResult?.Score,
                    TotalPoints = existingResult?.TotalPoints,
                    HasPassed = existingResult?.HasPassed,
                    StartedAt = existingResult?.StartedAt,
                    CompletedAt = existingResult?.CompletedAt
                });
            }
        }

        return availableTests.OrderBy(t => t.ScheduledDate).ToList();
    }

    public async Task<TestDetailDto> GetTestForCandidateAsync(Guid testId, Guid candidateId)
    {
        // Verify candidate is shortlisted for this test's job
        var test = await _context.MockTests
            .Include(t => t.Job)
            .Include(t => t.Questions.OrderBy(q => q.OrderNumber))
                .ThenInclude(q => q.Options.OrderBy(o => o.OrderNumber))
            .FirstOrDefaultAsync(t => t.Id == testId);

        if (test == null)
            throw new KeyNotFoundException("Test not found");

        var isShortlisted = await _context.JobApplications
            .AnyAsync(a => a.JobId == test.JobId && 
                          a.CandidateId == candidateId && 
                          a.Status == "Shortlisted");

        if (!isShortlisted)
            throw new UnauthorizedAccessException("You are not eligible for this test");

        return new TestDetailDto
        {
            Id = test.Id,
            JobId = test.JobId,
            JobTitle = test.Job.Title,
            Title = test.Title,
            Description = test.Description,
            ScheduledDate = test.ScheduledDate,
            StartTime = test.StartTime,
            DurationMinutes = test.DurationMinutes,
            PassingScore = test.PassingScore,
            Status = test.Status,
            Questions = test.Questions.Select(q => new TestQuestionDto
            {
                Id = q.Id,
                QuestionText = q.QuestionText,
                OrderNumber = q.OrderNumber,
                Points = q.Points,
                Options = q.Options.Select(o => new TestOptionDto
                {
                    Id = o.Id,
                    OptionText = o.OptionText,
                    OrderNumber = o.OrderNumber,
                    IsCorrect = null // Hide correct answer from candidate
                }).ToList()
            }).ToList(),
            CreatedAt = test.CreatedAt
        };
    }

    public async Task<TestResultSummaryDto> StartTestAsync(Guid testId, Guid candidateId)
    {
        var test = await _context.MockTests
            .Include(t => t.Questions)
            .FirstOrDefaultAsync(t => t.Id == testId);

        if (test == null)
            throw new KeyNotFoundException("Test not found");

        // Check if candidate is shortlisted
        var isShortlisted = await _context.JobApplications
            .AnyAsync(a => a.JobId == test.JobId && 
                          a.CandidateId == candidateId && 
                          a.Status == "Shortlisted");

        if (!isShortlisted)
            throw new UnauthorizedAccessException("You are not eligible for this test");

        // Check if already started
        var existingResult = await _context.TestResults
            .FirstOrDefaultAsync(r => r.MockTestId == testId && r.CandidateId == candidateId);

        if (existingResult != null)
            throw new InvalidOperationException("Test already started");

        var totalPoints = test.Questions.Sum(q => q.Points);

        var testResult = new TestResult
        {
            Id = Guid.NewGuid(),
            MockTestId = testId,
            CandidateId = candidateId,
            Score = 0,
            TotalPoints = totalPoints,
            Rank = 0,
            HasPassed = false,
            StartedAt = DateTime.UtcNow,
            CompletedAt = null,
            Status = "In Progress"
        };

        _context.TestResults.Add(testResult);
        test.TotalApplicants++;
        await _context.SaveChangesAsync();

        var candidate = await _context.Candidates
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == candidateId);

        return new TestResultSummaryDto
        {
            Id = testResult.Id,
            CandidateId = candidateId,
            CandidateName = candidate != null ? $"{candidate.FirstName} {candidate.LastName}" : "",
            CandidateEmail = candidate?.User.Email ?? "",
            Score = 0,
            TotalPoints = totalPoints,
            Percentage = 0,
            Rank = 0,
            HasPassed = false,
            CompletedAt = null,
            Status = "In Progress"
        };
    }

    public async Task<TestResultDetailDto> SubmitTestAsync(Guid testId, Guid candidateId, SubmitTestRequestDto request)
    {
        var testResult = await _context.TestResults
            .Include(r => r.MockTest)
                .ThenInclude(t => t.Questions)
                    .ThenInclude(q => q.Options)
            .Include(r => r.Candidate)
                .ThenInclude(c => c.User)
            .FirstOrDefaultAsync(r => r.MockTestId == testId && r.CandidateId == candidateId);

        if (testResult == null)
            throw new KeyNotFoundException("Test attempt not found. Please start the test first.");

        if (testResult.Status == "Completed")
            throw new InvalidOperationException("Test already submitted");

        int score = 0;
        var answers = new List<TestAnswer>();

        foreach (var answerDto in request.Answers)
        {
            var question = testResult.MockTest.Questions.FirstOrDefault(q => q.Id == answerDto.QuestionId);
            if (question == null) continue;

            var selectedOption = question.Options.FirstOrDefault(o => o.Id == answerDto.SelectedOptionId);
            if (selectedOption == null) continue;

            var isCorrect = selectedOption.IsCorrect;
            if (isCorrect)
                score += question.Points;

            var answer = new TestAnswer
            {
                Id = Guid.NewGuid(),
                TestResultId = testResult.Id,
                TestQuestionId = answerDto.QuestionId,
                SelectedOptionId = answerDto.SelectedOptionId,
                IsCorrect = isCorrect,
                AnsweredAt = DateTime.UtcNow
            };

            answers.Add(answer);
        }

        _context.TestAnswers.AddRange(answers);

        testResult.Score = score;
        testResult.HasPassed = score >= testResult.MockTest.PassingScore;
        testResult.CompletedAt = DateTime.UtcNow;
        testResult.Status = "Completed";

        await _context.SaveChangesAsync();

        // Reload with answers for detail
        testResult = await _context.TestResults
            .Include(r => r.Candidate)
                .ThenInclude(c => c.User)
            .Include(r => r.Answers)
                .ThenInclude(a => a.TestQuestion)
                    .ThenInclude(q => q.Options)
            .Include(r => r.Answers)
                .ThenInclude(a => a.SelectedOption)
            .FirstOrDefaultAsync(r => r.Id == testResult.Id);

        return new TestResultDetailDto
        {
            Id = testResult!.Id,
            CandidateId = testResult.CandidateId,
            CandidateName = $"{testResult.Candidate.FirstName} {testResult.Candidate.LastName}",
            CandidateEmail = testResult.Candidate.User.Email,
            Score = testResult.Score,
            TotalPoints = testResult.TotalPoints,
            Percentage = testResult.TotalPoints > 0 ? Math.Round((double)testResult.Score / testResult.TotalPoints * 100, 2) : 0,
            Rank = testResult.Rank,
            HasPassed = testResult.HasPassed,
            StartedAt = testResult.StartedAt,
            CompletedAt = testResult.CompletedAt,
            Status = testResult.Status,
            Answers = testResult.Answers.Select(a =>
            {
                var correctOption = a.TestQuestion.Options.FirstOrDefault(o => o.IsCorrect);
                return new TestAnswerDetailDto
                {
                    QuestionId = a.TestQuestionId,
                    QuestionText = a.TestQuestion.QuestionText,
                    Points = a.TestQuestion.Points,
                    SelectedOptionId = a.SelectedOptionId,
                    SelectedOptionText = a.SelectedOption.OptionText,
                    IsCorrect = a.IsCorrect,
                    CorrectOptionId = correctOption?.Id,
                    CorrectOptionText = correctOption?.OptionText
                };
            }).ToList()
        };
    }

    public async Task<TestResultDetailDto> GetMyTestResultAsync(Guid testId, Guid candidateId)
    {
        var result = await _context.TestResults
            .Include(r => r.MockTest)
            .Include(r => r.Candidate)
                .ThenInclude(c => c.User)
            .Include(r => r.Answers)
                .ThenInclude(a => a.TestQuestion)
                    .ThenInclude(q => q.Options)
            .Include(r => r.Answers)
                .ThenInclude(a => a.SelectedOption)
            .FirstOrDefaultAsync(r => r.MockTestId == testId && r.CandidateId == candidateId);

        if (result == null)
            throw new KeyNotFoundException("Test result not found");

        return new TestResultDetailDto
        {
            Id = result.Id,
            CandidateId = result.CandidateId,
            CandidateName = $"{result.Candidate.FirstName} {result.Candidate.LastName}",
            CandidateEmail = result.Candidate.User.Email,
            Score = result.Score,
            TotalPoints = result.TotalPoints,
            Percentage = result.TotalPoints > 0 ? Math.Round((double)result.Score / result.TotalPoints * 100, 2) : 0,
            Rank = result.Rank,
            HasPassed = result.HasPassed,
            StartedAt = result.StartedAt,
            CompletedAt = result.CompletedAt,
            Status = result.Status,
            Answers = result.Answers.Select(a =>
            {
                var correctOption = a.TestQuestion.Options.FirstOrDefault(o => o.IsCorrect);
                return new TestAnswerDetailDto
                {
                    QuestionId = a.TestQuestionId,
                    QuestionText = a.TestQuestion.QuestionText,
                    Points = a.TestQuestion.Points,
                    SelectedOptionId = a.SelectedOptionId,
                    SelectedOptionText = a.SelectedOption.OptionText,
                    IsCorrect = a.IsCorrect,
                    CorrectOptionId = correctOption?.Id,
                    CorrectOptionText = correctOption?.OptionText
                };
            }).ToList()
        };
    }
}
