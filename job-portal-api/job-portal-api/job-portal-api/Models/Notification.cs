namespace JobPortalApi.Models;

public class Notification
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // "ApplicationStatus", "JobAlert", "Message", etc.
    public string? RelatedEntityId { get; set; } // JobId, ApplicationId, etc.
    public string? RelatedEntityType { get; set; } // "Job", "Application", etc.
    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public User User { get; set; } = null!;
}
