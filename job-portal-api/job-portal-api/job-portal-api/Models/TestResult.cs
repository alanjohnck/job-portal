namespace JobPortalApi.Models;

public class TestResult
{
    public Guid Id { get; set; }                    
    public Guid MockTestId { get; set; }            
    public Guid CandidateId { get; set; }           

    public int Score { get; set; }                  
    public int TotalPoints { get; set; }            // Maximum possible points
    public int Rank { get; set; }                   
    public bool HasPassed { get; set; }
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }      // Nullable until submitted
    public string Status { get; set; } = "In Progress"; // "In Progress", "Completed"

    // Navigation Properties
    public MockTest MockTest { get; set; } = null!;
    public Candidate Candidate { get; set; } = null!;
    public ICollection<TestAnswer> Answers { get; set; } = new List<TestAnswer>();
}
