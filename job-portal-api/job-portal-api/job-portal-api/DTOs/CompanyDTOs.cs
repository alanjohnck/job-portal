namespace JobPortalApi.DTOs;

public class SavedCandidateDto
{
    public Guid Id { get; set; }
    public CandidateProfileDto Candidate { get; set; } = new();
    public string? Notes { get; set; }
    public DateTime SavedAt { get; set; }
}

public class JobApplicationDetailDto
{
    public Guid Id { get; set; }
    public CandidateProfileDto Candidate { get; set; } = new();
    public string? CoverLetter { get; set; }
    public string? ResumeUrl { get; set; }
    public string Status { get; set; } = string.Empty;
    public string KanbanColumn { get; set; } = string.Empty;
    public DateTime AppliedAt { get; set; }
}

public class CompanyDashboardStats
{
    public int TotalJobs { get; set; }
    public int ActiveJobs { get; set; }
    public int TotalApplications { get; set; }
    public int NewApplicationsToday { get; set; }
    public int ProfileViews { get; set; } // Mock data for now
}
