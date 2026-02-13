namespace JobPortalApi.Models;

public class Candidate
{
    public Guid Id { get; set; }                    
    public Guid UserId { get; set; }                

    // Personal Info
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }             // "Male", "Female", "Other"
    public string? CurrentLocation { get; set; }
    public string? ProfilePicture { get; set; }     

    // Professional Info
    public string? CurrentJobTitle { get; set; }
    public string? Education { get; set; }          
    public int? ExperienceYears { get; set; }
    public string[] Skills { get; set; } = Array.Empty<string>();
    public string? ResumeUrl { get; set; }          
    public string? Bio { get; set; }                

    // Social Links
    public string? LinkedInUrl { get; set; }
    public string? GithubUrl { get; set; }
    public string? PortfolioUrl { get; set; }
    public string? TwitterUrl { get; set; }

    // Preferences
    public string[] PreferredJobTypes { get; set; } = Array.Empty<string>();
    public decimal? ExpectedSalary { get; set; }
    public string[] PreferredLocations { get; set; } = Array.Empty<string>();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    public User User { get; set; } = null!;
    public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
    public ICollection<SavedJob> SavedJobs { get; set; } = new List<SavedJob>();
    public ICollection<TestResult> TestResults { get; set; } = new List<TestResult>();
    public ICollection<WorkExperience> WorkExperiences { get; set; } = new List<WorkExperience>();
    public ICollection<Education> Educations { get; set; } = new List<Education>();
    public ICollection<Certification> Certifications { get; set; } = new List<Certification>();
}
