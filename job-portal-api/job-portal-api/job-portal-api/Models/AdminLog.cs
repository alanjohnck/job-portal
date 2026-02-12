using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JobPortalApi.Models;

public class AdminLog
{
    public Guid Id { get; set; }
    public Guid AdminUserId { get; set; }
    public string Action { get; set; } = string.Empty; // "Deactivated User", "Deleted Job", etc.
    public string TargetType { get; set; } = string.Empty; // "User", "Company", "Job"
    public Guid? TargetId { get; set; }
    public string? Details { get; set; }            
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    // Navigation
    [ForeignKey("AdminUserId")]
    public User Admin { get; set; } = null!;
}
