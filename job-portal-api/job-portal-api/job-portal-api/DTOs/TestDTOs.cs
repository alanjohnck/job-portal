namespace JobPortalApi.DTOs;

// Request DTOs

public class CreateTestRequestDto
{
    public Guid JobId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime ScheduledDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public int DurationMinutes { get; set; }
    public int PassingScore { get; set; }
}

public class AddQuestionRequestDto
{
    public string QuestionText { get; set; } = string.Empty;
    public int OrderNumber { get; set; }
    public int Points { get; set; } = 1;
    public List<QuestionOptionDto> Options { get; set; } = new();
}

public class QuestionOptionDto
{
    public string OptionText { get; set; } = string.Empty;
    public int OrderNumber { get; set; }
    public bool IsCorrect { get; set; }
}

public class SubmitTestRequestDto
{
    public List<TestAnswerDto> Answers { get; set; } = new();
}

public class TestAnswerDto
{
    public Guid QuestionId { get; set; }
    public Guid SelectedOptionId { get; set; }
}

// Response DTOs

public class TestDto
{
    public Guid Id { get; set; }
    public Guid JobId { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime ScheduledDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public int DurationMinutes { get; set; }
    public int PassingScore { get; set; }
    public string Status { get; set; } = string.Empty;
    public int TotalQuestions { get; set; }
    public int TotalApplicants { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class TestDetailDto
{
    public Guid Id { get; set; }
    public Guid JobId { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime ScheduledDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public int DurationMinutes { get; set; }
    public int PassingScore { get; set; }
    public string Status { get; set; } = string.Empty;
    public List<TestQuestionDto> Questions { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

    public class TestAttemptDto
    {
    public Guid Id { get; set; }
    public Guid TestId { get; set; }
    public string TestTitle { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public DateTime ScheduledDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public int DurationMinutes { get; set; }
    public string Status { get; set; } = string.Empty; // "Not Started", "In Progress", "Completed"
    public int? Score { get; set; }
    public int? TotalPoints { get; set; }
    public bool? HasPassed { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}

public class TestResultSummaryDto
{
    public Guid Id { get; set; }
    public Guid CandidateId { get; set; }
    public string CandidateName { get; set; } = string.Empty;
    public string CandidateEmail { get; set; } = string.Empty;
    public int Score { get; set; }
    public int TotalPoints { get; set; }
    public double Percentage { get; set; }
    public int Rank { get; set; }
    public bool HasPassed { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class TestResultDetailDto
{
    public Guid Id { get; set; }
    public Guid CandidateId { get; set; }
    public string CandidateName { get; set; } = string.Empty;
    public string CandidateEmail { get; set; } = string.Empty;
    public int Score { get; set; }
    public int TotalPoints { get; set; }
    public double Percentage { get; set; }
    public int Rank { get; set; }
    public bool HasPassed { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string Status { get; set; } = string.Empty;
    public List<TestAnswerDetailDto> Answers { get; set; } = new();
}

public class TestAnswerDetailDto
{
    public Guid QuestionId { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public int Points { get; set; }
    public Guid SelectedOptionId { get; set; }
    public string SelectedOptionText { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
    public Guid? CorrectOptionId { get; set; }
    public string? CorrectOptionText { get; set; }
}
