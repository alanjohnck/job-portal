namespace JobPortalApi.DTOs;

// Auth DTOs
public class RegisterCandidateRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName {get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
}

public class RegisterCompanyRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string CompanyEmail { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Industry { get; set; } = string.Empty;
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public int ExpiresIn { get; set; }
    public UserInfo User { get; set; } = new();
}

public class UserInfo
{
    public Guid UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public Guid? ProfileId { get; set; }
}

public class RefreshTokenRequest
{
    public string RefreshToken { get; set; } = string.Empty;
}

public class ForgotPasswordRequest
{
    public string Email { get; set; } = string.Empty;
}

public class ResetPasswordRequest
{
    public string Token { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}

// Candidate DTOs
public class CandidateProfileDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? CurrentLocation { get; set; }
    public string? ProfilePicture { get; set; }
    public string? CurrentJobTitle { get; set; }
    public string? Education { get; set; }
    public int? ExperienceYears { get; set; }
    public string[] Skills { get; set; } = Array.Empty<string>();
    public string? ResumeUrl { get; set; }
    public string? Bio { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? GithubUrl { get; set; }
    public string? PortfolioUrl { get; set; }
    public string? TwitterUrl { get; set; }
    public string[] PreferredJobTypes { get; set; } = Array.Empty<string>();
    public decimal? ExpectedSalary { get; set; }
    public string[] PreferredLocations { get; set; } = Array.Empty<string>();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class UpdateCandidateProfileRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? CurrentLocation { get; set; }
    public string? CurrentJobTitle { get; set; }
    public string? Education { get; set; }
    public int? ExperienceYears { get; set; }
    public string[] Skills { get; set; } = Array.Empty<string>();
    public string? Bio { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? GithubUrl { get; set; }
    public string? PortfolioUrl { get; set; }
    public string? TwitterUrl { get; set; }
    public string[] PreferredJobTypes { get; set; } = Array.Empty<string>();
    public decimal? ExpectedSalary { get; set; }
    public string[] PreferredLocations { get; set; } = Array.Empty<string>();
}

// Company DTOs
public class CompanyProfileDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string CompanyEmail { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Website { get; set; }
    public string? Industry { get; set; }
    public string? CompanySize { get; set; }
    public string? Description { get; set; }
    public string? Logo { get; set; }
    public string? BannerImage { get; set; }
    public string? HeadquarterAddress { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public string? ZipCode { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? TwitterUrl { get; set; }
    public string? FacebookUrl { get; set; }
    public DateTime? Founded { get; set; }
    public string[] TechStack { get; set; } = Array.Empty<string>();
    public string SubscriptionPlan { get; set; } = "Free";
    public DateTime? SubscriptionExpiresAt { get; set; }
    public bool IsFeatured { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class UpdateCompanyProfileRequest
{
    public string CompanyName { get; set; } = string.Empty;
    public string CompanyEmail { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Website { get; set; }
    public string? Industry { get; set; }
    public string? CompanySize { get; set; }
    public string? Description { get; set; }
    public string? HeadquarterAddress { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public string? ZipCode { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? TwitterUrl { get; set; }
    public string? FacebookUrl { get; set; }
    public DateTime? Founded { get; set; }
    public string[] TechStack { get; set; } = Array.Empty<string>();
}

// Job DTOs
public class CreateJobRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string[] Requirements { get; set; } = Array.Empty<string>();
    public string[] Responsibilities { get; set; } = Array.Empty<string>();
    public string JobType { get; set; } = string.Empty;
    public string ExperienceLevel { get; set; } = string.Empty;
    public decimal? MinSalary { get; set; }
    public decimal? MaxSalary { get; set; }
    public string SalaryCurrency { get; set; } = "USD";
    public string SalaryPeriod { get; set; } = "Yearly";
    public string Location { get; set; } = string.Empty;
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public bool IsRemote { get; set; }
    public string[] RequiredSkills { get; set; } = Array.Empty<string>();
    public string[] Tags { get; set; } = Array.Empty<string>();
    public string? Category { get; set; }
    public DateTime? Deadline { get; set; }
    public int? Openings { get; set; }
    public string? Education { get; set; }
    public string? Experience { get; set; }
    public string Status { get; set; } = "Active";
}

public class JobDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string[] Requirements { get; set; } = Array.Empty<string>();
    public string[] Responsibilities { get; set; } = Array.Empty<string>();
    public string JobType { get; set; } = string.Empty;
    public string ExperienceLevel { get; set; } = string.Empty;
    public decimal? MinSalary { get; set; }
    public decimal? MaxSalary { get; set; }
    public string SalaryCurrency { get; set; } = "USD";
    public string SalaryPeriod { get; set; } = "Yearly";
    public string Location { get; set; } = string.Empty;
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public bool IsRemote { get; set; }
    public string[] RequiredSkills { get; set; } = Array.Empty<string>();
    public string[] Tags { get; set; } = Array.Empty<string>();
    public string? Category { get; set; }
    public string Status { get; set; } = "Active";
    public DateTime? Deadline { get; set; }
    public int? Openings { get; set; }
    public string? Education { get; set; }
    public string? Experience { get; set; }
    public CompanyBasicInfo Company { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public int ApplicationsCount { get; set; }
    public bool HasApplied { get; set; }
    public bool IsSaved { get; set; }
}

public class CompanyBasicInfo
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Logo { get; set; }
    public string? Industry { get; set; }
    public string? CompanySize { get; set; }
    public string? Website { get; set; }
}

// Application DTOs
public class ApplyForJobRequest
{
    public string? CoverLetter { get; set; }
    public string? ResumeUrl { get; set; }
}

public class JobApplicationDto
{
    public Guid Id { get; set; }
    public JobBasicInfo Job { get; set; } = new();
    public string Status { get; set; } = string.Empty;
    public DateTime AppliedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class JobBasicInfo
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public CompanyBasicInfo Company { get; set; } = new();
}

public class UpdateApplicationStatusRequest
{
    public string Status { get; set; } = string.Empty;
    public string? KanbanColumn { get; set; }
}
