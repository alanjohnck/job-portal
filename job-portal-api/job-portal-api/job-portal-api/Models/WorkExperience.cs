namespace JobPortalApi.Models;

public class WorkExperience
{
    public Guid Id { get; set; }
    public Guid CandidateId { get; set; }
    
    public string JobTitle { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? EmploymentType { get; set; } // Full-time, Part-time, Contract, Internship, Freelance
    
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrentJob { get; set; }
    
    public string? Description { get; set; }
    public string[] Achievements { get; set; } = Array.Empty<string>();
    public string[] TechnologiesUsed { get; set; } = Array.Empty<string>();
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation Properties
    public Candidate Candidate { get; set; } = null!;
}
