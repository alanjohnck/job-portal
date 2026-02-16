namespace JobPortalApi.Models;

public class SupportTicket
{
    public Guid Id { get; set; }                    
    public string TicketNumber { get; set; } = string.Empty;
    public Guid UserId { get; set; }                
    public string UserType { get; set; } = string.Empty; // "Candidate", "Company"

    public string Subject { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = "General"; // "General", "Technical", "Billing", "Account"
    public string Priority { get; set; } = "Medium"; // "Low", "Medium", "High"
    public string Status { get; set; } = "Open";    // "Open", "InProgress", "Closed", "Resolved"

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ClosedAt { get; set; }

    // Navigation Properties
    public User User { get; set; } = null!;
}
