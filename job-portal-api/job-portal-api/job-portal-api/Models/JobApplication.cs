namespace JobPortalApi.Models;

public class JobApplication
{
    public Guid Id { get; set; }                    
    public Guid JobId { get; set; }                 
    public Guid CandidateId { get; set; }           

    // Application Details
    public string? CoverLetter { get; set; }
    public string? ResumeUrl { get; set; }          
    public string Status { get; set; } = "Applied"; // "Applied", "Shortlisted", "Interviewed", "Offered", "Rejected"
    public string KanbanColumn { get; set; } = "All Application"; // For tracking in Company Kanban

    // Metadata
    public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ViewedAt { get; set; }         
    public DateTime? UpdatedAt { get; set; }

    // Navigation Properties
    public Job Job { get; set; } = null!;
    public Candidate Candidate { get; set; } = null!;
}
