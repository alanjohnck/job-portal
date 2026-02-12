namespace JobPortalApi.DTOs;

public class CreateMockTestRequest
{
    public Guid JobId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime ScheduledDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public int DurationMinutes { get; set; }
    public int PassingScore { get; set; }
    public string Status { get; set; } = "Scheduled";
}

public class MockTestDto
{
    public Guid Id { get; set; }
    public Guid JobId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime ScheduledDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public int DurationMinutes { get; set; }
    public int PassingScore { get; set; }
    public string Status { get; set; } = string.Empty;
    public int TotalApplicants { get; set; }
    public CompanyBasicInfo Company { get; set; } = new();
}

public class TestResultDto
{
    public Guid Id { get; set; }
    public Guid MockTestId { get; set; }
    public CandidateProfileDto Candidate { get; set; } = new();
    public int Score { get; set; }
    public int Rank { get; set; }
    public bool HasPassed { get; set; }
    public DateTime CompletedAt { get; set; }
}

public class SubmitTestRequest
{
    public int Score { get; set; }
}

