namespace JobPortalApi.Models;

public class Company
{
    public Guid Id { get; set; }                    
    public Guid UserId { get; set; }                

    // Basic Info
    public string CompanyName { get; set; } = string.Empty;
    public string CompanyEmail { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Website { get; set; }

    // Company Details
    public string? Industry { get; set; }           
    public string? CompanySize { get; set; }        // "1-50", "51-200", "201-500", "500+"
    public string? Description { get; set; }        
    public string? Logo { get; set; }               
    public string? BannerImage { get; set; }        

    // Location
    public string? HeadquarterAddress { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public string? ZipCode { get; set; }

    // Social Links
    public string? LinkedInUrl { get; set; }
    public string? TwitterUrl { get; set; }
    public string? FacebookUrl { get; set; }

    // Business Info
    public DateTime? Founded { get; set; }
    public string[] TechStack { get; set; } = Array.Empty<string>();
    public decimal? AnnualRevenue { get; set; }     

    // Subscription/Billing
    public string SubscriptionPlan { get; set; } = "Free"; // "Free", "Basic", "Premium", "Enterprise"
    public DateTime? SubscriptionExpiresAt { get; set; }
    public bool IsFeatured { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    public User User { get; set; } = null!;
    public ICollection<Job> Jobs { get; set; } = new List<Job>();
    public ICollection<SavedCandidate> SavedCandidates { get; set; } = new List<SavedCandidate>();
    public ICollection<MockTest> MockTests { get; set; } = new List<MockTest>();
}
