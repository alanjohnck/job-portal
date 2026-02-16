namespace JobPortalApi.DTOs;

public class CreateMockTestRequest
{
    public Guid JobId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime ScheduledDate { get; set; }
    public string StartTime { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public int PassingScore { get; set; }
    public string Status { get; set; } = "Scheduled";
    public List<TestQuestionDto> Questions { get; set; } = new();
}

public class MockTestDto
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
    public int TotalApplicants { get; set; }
    public CompanyBasicInfo Company { get; set; } = new();
    public List<TestQuestionDto> Questions { get; set; } = new();
}

public class TestQuestionDto
{
    public Guid Id { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public int Points { get; set; }
    public int OrderNumber { get; set; }
    public List<TestQuestionOptionDto> Options { get; set; } = new();
}

public class TestQuestionOptionDto
{
    public Guid Id { get; set; }
    public string OptionText { get; set; } = string.Empty;
    public int OrderNumber { get; set; }
    public bool? IsCorrect { get; set; } // Candidate shouldn't see this ideally during test, but for simplicity we send it or handle on backend. Ideally backend should score.
    // However, the current SubmitTest endpoint accepts 'Score', implying frontend calculates score. So IsCorrect is needed.
}

public class TestResultDto
{
    public Guid Id { get; set; }
    public Guid MockTestId { get; set; }
    public CandidateProfileDto Candidate { get; set; } = new();
    public int Score { get; set; }
    public int Rank { get; set; }
    public bool HasPassed { get; set; }
    public DateTime? CompletedAt { get; set; }
}

public class SubmitTestRequest
{
    public int Score { get; set; }
}

