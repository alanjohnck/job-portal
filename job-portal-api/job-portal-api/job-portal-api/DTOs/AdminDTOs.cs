namespace JobPortalApi.DTOs;

public class AdminDashboardStats
{
    public int TotalUsers { get; set; }
    public int TotalCompanies { get; set; }
    public int TotalCandidates { get; set; }
    public int TotalActiveJobs { get; set; }
    public int TotalApplications { get; set; }
    public int Revenue { get; set; } // Mock value for subscriptions
}

public class ActivityDto
{
    public Guid Id { get; set; }
    public string Action { get; set; } = string.Empty;
    public string Target { get; set; } = string.Empty; // e.g., "User: John Doe"
    public DateTime Timestamp { get; set; }
    public string AdminEmail { get; set; } = string.Empty;
}

public class UserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty; // Added FullName
    public string Role { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
}

public class SupportTicketDto
{
    public Guid Id { get; set; }
    public string TicketNumber { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string UserEmail { get; set; } = string.Empty;
    public string UserRole { get; set; } = string.Empty;
}

public class CreateSupportTicketRequest
{
    public string Subject { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Priority { get; set; } = "Medium";
    public string Type { get; set; } = "General";
}
