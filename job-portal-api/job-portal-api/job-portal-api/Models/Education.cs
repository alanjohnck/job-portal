namespace JobPortalApi.Models;

public class Education
{
    public Guid Id { get; set; }
    public Guid CandidateId { get; set; }
    
    public string InstitutionName { get; set; } = string.Empty;
    public string Degree { get; set; } = string.Empty;
    public string FieldOfStudy { get; set; } = string.Empty;
    
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrentlyStudying { get; set; }
    
    public string? Grade { get; set; }
    public string? Description { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public Candidate Candidate { get; set; } = null!;
}
