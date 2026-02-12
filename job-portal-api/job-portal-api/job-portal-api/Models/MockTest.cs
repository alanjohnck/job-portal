namespace JobPortalApi.Models;

public class MockTest
{
    public Guid Id { get; set; }                    
    public Guid JobId { get; set; }                 
    public Guid CompanyId { get; set; }             

    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime ScheduledDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public int DurationMinutes { get; set; }
    public int PassingScore { get; set; }           

    public string Status { get; set; } = "Scheduled"; // "Scheduled", "In Progress", "Finished"
    public int TotalApplicants { get; set; } = 0;   

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    public Job Job { get; set; } = null!;
    public Company Company { get; set; } = null!;
    public ICollection<TestResult> TestResults { get; set; } = new List<TestResult>();
}
