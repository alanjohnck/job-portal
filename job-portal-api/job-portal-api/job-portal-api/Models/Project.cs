namespace JobPortalApi.Models;

public class Project
{
    public Guid Id { get; set; }
    public Guid CandidateId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string[] Technologies { get; set; } = Array.Empty<string>();
    public string? ProjectUrl { get; set; }
    public string? RepoUrl { get; set; }
    public string? ImageUrl { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation Properties
    public Candidate Candidate { get; set; } = null!;
}
