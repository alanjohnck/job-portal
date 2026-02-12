namespace JobPortalApi.Models;

public class TestResult
{
    public Guid Id { get; set; }                    
    public Guid MockTestId { get; set; }            
    public Guid CandidateId { get; set; }           

    public int Score { get; set; }                  
    public int Rank { get; set; }                   
    public bool HasPassed { get; set; }
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    public MockTest MockTest { get; set; } = null!;
    public Candidate Candidate { get; set; } = null!;
}
