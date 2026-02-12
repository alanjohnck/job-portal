namespace JobPortalApi.Models;

public class Job
{
    public Guid Id { get; set; }                    
    public Guid CompanyId { get; set; }             

    // Basic Info
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string[] Requirements { get; set; } = Array.Empty<string>();
    public string[] Responsibilities { get; set; } = Array.Empty<string>();

    // Job Details
    public string JobType { get; set; } = string.Empty; // "Full Time", "Part Time", "Contract", "Remote"
    public string ExperienceLevel { get; set; } = string.Empty; // "Entry", "Mid", "Senior", "Lead"
    public decimal? MinSalary { get; set; }
    public decimal? MaxSalary { get; set; }
    public string SalaryCurrency { get; set; } = "USD";
    public string SalaryPeriod { get; set; } = "Yearly"; // "Hourly", "Monthly", "Yearly"

    // Location
    public string Location { get; set; } = string.Empty;
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public bool IsRemote { get; set; } = false;

    // Skills & Tags
    public string[] RequiredSkills { get; set; } = Array.Empty<string>();
    public string[] Tags { get; set; } = Array.Empty<string>();
    public string? Category { get; set; }           // "Engineering", "Design", "Marketing", etc.

    // Status & Dates
    public string Status { get; set; } = "Active";  // "Active", "Closed", "Draft"
    public DateTime? Deadline { get; set; }         
    public int? Openings { get; set; }    
    public string? Education { get; set; }
    public string? Experience { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    public Company Company { get; set; } = null!;
    public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
    public ICollection<MockTest> MockTests { get; set; } = new List<MockTest>();
    public ICollection<SavedJob> SavedJobs { get; set; } = new List<SavedJob>();
}
