namespace JobPortalApi.Models;

public class Certification
{
    public Guid Id { get; set; }
    public Guid CandidateId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    public string IssuingOrganization { get; set; } = string.Empty;
    
    public DateTime IssueDate { get; set; }
    public DateTime? ExpiryDate { get; set; }
    
    public string? CredentialId { get; set; }
    public string? CredentialUrl { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation Properties
    public Candidate Candidate { get; set; } = null!;
}
