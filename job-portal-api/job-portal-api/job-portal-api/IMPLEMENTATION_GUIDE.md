# Implementation Guide - Remaining Features

This guide will help you complete the Job Portal API by implementing the remaining controllers and services.

## Phase 1: Candidate Features

### 1.1 Create CandidateService

Create `Services/ICandidateService.cs`:
```csharp
public interface ICandidateService
{
    Task<ApiResponse<CandidateProfileDto>> GetProfileAsync(Guid userId);
    Task<ApiResponse<CandidateProfileDto>> UpdateProfileAsync(Guid userId, UpdateCandidateProfileRequest request);
    Task<ApiResponse<string>> UploadProfilePictureAsync(Guid userId, IFormFile file);
    Task<ApiResponse<string>> UploadResumeAsync(Guid userId, IFormFile file);
    Task<ApiResponse<PaginationResponse<JobDto>>> SearchJobsAsync(JobSearchParams searchParams, Guid? userId = null);
    Task<ApiResponse<JobDto>> GetJobDetailsAsync(Guid jobId, Guid? userId = null);
    Task<ApiResponse<object>> ApplyForJobAsync(Guid userId, Guid jobId, ApplyForJobRequest request);
    Task<ApiResponse<PaginationResponse<JobApplicationDto>>> GetMyApplicationsAsync(Guid userId, string? status, int page, int pageSize);
    Task<ApiResponse<object>> SaveJobAsync(Guid userId, Guid jobId);
    Task<ApiResponse<object>> UnsaveJobAsync(Guid userId, Guid jobId);
    Task<ApiResponse<List<JobDto>>> GetSavedJobsAsync(Guid userId);
}
```

### 1.2 Create CandidateController

Create `Controllers/CandidateController.cs`:
```csharp
[ApiController]
[Route("api/v1/candidates")]
[Authorize(Roles = "Candidate")]
public class CandidateController : ControllerBase
{
    // Implement all endpoints here
    // GET /profile
    // PUT /profile
    // POST /profile/picture
    // POST /profile/resume
    // GET /jobs/search
    // GET /jobs/{jobId}
    // POST /jobs/{jobId}/apply
    // GET /applications
    // POST /jobs/{jobId}/save
    // DELETE /jobs/{jobId}/save
    // GET /jobs/saved
}
```

## Phase 2: Company Features

### 2.1 Create CompanyService

Create `Services/ICompanyService.cs`:
```csharp
public interface ICompanyService
{
    // Profile Management
    Task<ApiResponse<CompanyProfileDto>> GetProfileAsync(Guid userId);
    Task<ApiResponse<CompanyProfileDto>> UpdateProfileAsync(Guid userId, UpdateCompanyProfileRequest request);
    Task<ApiResponse<string>> UploadLogoAsync(Guid userId, IFormFile file);
    Task<ApiResponse<string>> UploadBannerAsync(Guid userId, IFormFile file);
    
    // Dashboard
    Task<ApiResponse<CompanyDashboardStats>> GetDashboardStatsAsync(Guid companyId);
    
    // Job Management
    Task<ApiResponse<JobDto>> CreateJobAsync(Guid companyId, CreateJobRequest request);
    Task<ApiResponse<JobDto>> UpdateJobAsync(Guid companyId, Guid jobId, CreateJobRequest request);
    Task<ApiResponse<object>> DeleteJobAsync(Guid companyId, Guid jobId);
    Task<ApiResponse<PaginationResponse<JobDto>>> GetCompanyJobsAsync(Guid companyId, string? status, int page, int pageSize);
    
    // Application Management
    Task<ApiResponse<List<JobApplicationDetailDto>>> GetJobApplicationsAsync(Guid companyId, Guid jobId, string? status);
    Task<ApiResponse<object>> UpdateApplicationStatusAsync(Guid companyId, Guid applicationId, UpdateApplicationStatusRequest request);
    
    // Candidate Management
    Task<ApiResponse<PaginationResponse<CandidateDto>>> SearchCandidatesAsync(CandidateSearchParams searchParams);
    Task<ApiResponse<object>> SaveCandidateAsync(Guid companyId, Guid candidateId, SaveCandidateRequest request);
    Task<ApiResponse<List<SavedCandidateDto>>> GetSavedCandidatesAsync(Guid companyId);
    Task<ApiResponse<object>> RemoveSavedCandidateAsync(Guid companyId, Guid candidateId);
}
```

### 2.2 Create CompanyController

Create `Controllers/CompanyController.cs` with all company endpoints.

## Phase 3: Mock Test Features

### 3.1 Create MockTestService

Create `Services/IMockTestService.cs`:
```csharp
public interface IMockTestService
{
    Task<ApiResponse<MockTestDto>> CreateMockTestAsync(Guid companyId, CreateMockTestRequest request);
    Task<ApiResponse<List<MockTestDto>>> GetCompanyMockTestsAsync(Guid companyId, string? status, Guid? jobId);
    Task<ApiResponse<List<TestResultDto>>> GetTestResultsAsync(Guid companyId, Guid mockTestId, int topN = 50);
    Task<ApiResponse<MockTestDto>> UpdateMockTestAsync(Guid companyId, Guid mockTestId, CreateMockTestRequest request);
    Task<ApiResponse<object>> DeleteMockTestAsync(Guid companyId, Guid mockTestId);
}
```

## Phase 4: Admin Features

### 4.1 Create AdminService

Create `Services/IAdminService.cs`:
```csharp
public interface IAdminService
{
    // Dashboard
    Task<ApiResponse<AdminDashboardStats>> GetDashboardStatsAsync();
    Task<ApiResponse<List<ActivityDto>>> GetRecentActivityAsync(int limit = 20);
    
    // User Management
    Task<ApiResponse<PaginationResponse<UserDto>>> GetAllUsersAsync(string? role, string? status, string? search, int page, int pageSize);
    Task<ApiResponse<object>> DeactivateUserAsync(Guid adminUserId, Guid userId);
    Task<ApiResponse<object>> ActivateUserAsync(Guid adminUserId, Guid userId);
    
    // Company Management
    Task<ApiResponse<PaginationResponse<CompanyDto>>> GetAllCompaniesAsync(string? status, string? industry, string? search, int page, int pageSize);
    Task<ApiResponse<object>> DeactivateCompanyAsync(Guid adminUserId, Guid companyId);
    Task<ApiResponse<object>> ActivateCompanyAsync(Guid adminUserId, Guid companyId);
    
    // Job Management
    Task<ApiResponse<PaginationResponse<JobDto>>> GetAllJobsAsync(string? status, Guid? companyId, string? search, int page, int pageSize);
    Task<ApiResponse<object>> DeleteJobAsync(Guid adminUserId, Guid jobId);
    
    // Support Ticket Management
    Task<ApiResponse<PaginationResponse<SupportTicketDto>>> GetSupportTicketsAsync(string? status, string? priority, string? userType, int page, int pageSize);
    Task<ApiResponse<object>> UpdateTicketStatusAsync(Guid ticketId, string status);
    Task<ApiResponse<object>> CloseTicketAsync(Guid ticketId);
}
```

### 4.2 Create AdminController

Create `Controllers/AdminController.cs` with admin endpoints, protected by `[Authorize(Roles = "Admin")]`.

## Phase 5: Support Ticket Features

### 5.1 Create SupportService

Create `Services/ISupportService.cs`:
```csharp
public interface ISupportService
{
    Task<ApiResponse<SupportTicketDto>> CreateTicketAsync(Guid userId, CreateSupportTicketRequest request);
    Task<ApiResponse<List<SupportTicketDto>>> GetMyTicketsAsync(Guid userId, string? status);
}
```

### 5.2 Create SupportController

Create `Controllers/SupportController.cs`.

## Phase 6: File Storage Service

### 6.1 Create FileStorageService

Create `Services/IFileStorageService.cs`:
```csharp
public interface IFileStorageService
{
    Task<string> UploadFileAsync(IFormFile file, string containerName, string? fileName = null);
    Task<bool> DeleteFileAsync(string fileUrl);
    Task<Stream> DownloadFileAsync(string fileUrl);
}
```

Create `Services/AzureBlobStorageService.cs`:
```csharp
public class AzureBlobStorageService : IFileStorageService
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly AzureStorageSettings _settings;

    public AzureBlobStorageService(AzureStorageSettings settings)
    {
        _settings = settings;
        _blobServiceClient = new BlobServiceClient(settings.ConnectionString);
    }

    public async Task<string> UploadFileAsync(IFormFile file, string containerName, string? fileName = null)
    {
        var container = _blobServiceClient.GetBlobContainerClient(containerName);
        await container.CreateIfNotExistsAsync();
        await container.SetAccessPolicyAsync(PublicAccessType.Blob);

        var extension = Path.GetExtension(file.FileName);
        var blobName = fileName ?? $"{Guid.NewGuid()}{extension}";
        
        var blobClient = container.GetBlobClient(blobName);
        
        using (var stream = file.OpenReadStream())
        {
            await blobClient.UploadAsync(stream, overwrite: true);
        }

        return blobClient.Uri.ToString();
    }
    
    // Implement other methods
}
```

## Phase 7: Email Service

### 7.1 Create EmailService

Create `Services/IEmailService.cs`:
```csharp
public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string htmlBody);
    Task SendWelcomeEmailAsync(string to, string firstName);
    Task SendPasswordResetEmailAsync(string to, string resetToken);
    Task SendEmailVerificationAsync(string to, string verificationToken);
}
```

Create `Services/EmailService.cs` using MailKit.

## Phase 8: Add Validators

### 8.1 Install FluentValidation (Already added in packages)

### 8.2 Create Validators

Create `Validators/RegisterCandidateValidator.cs`:
```csharp
public class RegisterCandidateValidator : AbstractValidator<RegisterCandidateRequest>
{
    public RegisterCandidateValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8);
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.PhoneNumber).NotEmpty().Matches(@"^\+?[1-9]\d{1,14}$");
    }
}
```

Create similar validators for all DTOs.

### 8.3 Register Validators in Program.cs

```csharp
builder.Services.AddValidatorsFromAssemblyContaining<RegisterCandidateValidator>();
```

## Phase 9: Add AutoMapper

### 9.1 Create Mapping Profiles

Create `Helpers/MappingProfile.cs`:
```csharp
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Candidate, CandidateProfileDto>()
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email));
        
        CreateMap<Company, CompanyProfileDto>();
        CreateMap<Job, JobDto>()
            .ForMember(dest => dest.Company, opt => opt.MapFrom(src => src.Company));
        
        // Add more mappings
    }
}
```

### 9.2 Register AutoMapper in Program.cs

```csharp
builder.Services.AddAutoMapper(typeof(MappingProfile));
```

## Phase 10: Create Database Migration

### 10.1 Add Migration

```bash
dotnet ef migrations add InitialCreate
```

### 10.2 Update Database

```bash
dotnet ef database update
```

## Phase 11: Testing

### 11.1 Create Unit Tests

Create a test project:
```bash
dotnet new xunit -n JobPortalApi.Tests
dotnet add reference ../JobPortalApi/JobPortalApi.csproj
```

### 11.2 Add Test Packages

```bash
dotnet add package Moq
dotnet add package FluentAssertions
dotnet add package Microsoft.EntityFrameworkCore.InMemory
```

### 11.3 Create Sample Tests

Create `Tests/Services/AuthServiceTests.cs`:
```csharp
public class AuthServiceTests
{
    [Fact]
    public async Task RegisterCandidate_WithValidData_ReturnsSuccess()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<JobPortalDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb")
            .Options;
        
        using var context = new JobPortalDbContext(options);
        var jwtSettings = new JwtSettings { SecretKey = "test_key_minimum_32_characters_long!" };
        var jwtHelper = new JwtTokenHelper(jwtSettings);
        var service = new AuthService(context, jwtHelper, jwtSettings);

        // Act
        var result = await service.RegisterCandidateAsync(new RegisterCandidateRequest
        {
            Email = "test@example.com",
            Password = "Password123!",
            FirstName = "Test",
            LastName = "User",
            PhoneNumber = "+1234567890"
        });

        // Assert
        Assert.True(result.Success);
        Assert.NotNull(result.Data);
    }
}
```

## Directory Structure After Completion

```
job-portal-api/
├── Controllers/
│   ├── AdminController.cs
│   ├── AuthController.cs
│   ├── CandidateController.cs
│   ├── CompanyController.cs
│   ├── MockTestController.cs
│   └── SupportController.cs
├── Data/
│   └── JobPortalDbContext.cs
├── DTOs/
│   ├── AdminDTOs.cs
│   ├── CandidateDTOs.cs
│   ├── CompanyDTOs.cs
│   ├── CommonDTOs.cs
│   └── MockTestDTOs.cs
├── Helpers/
│   ├── ApiResponse.cs
│   ├── AppSettings.cs
│   ├── JwtTokenHelper.cs
│   └── MappingProfile.cs
├── Middleware/
│   └── GlobalExceptionMiddleware.cs
├── Migrations/
│   └── (generated files)
├── Models/
│   └── (all 12 models)
├── Repositories/
│   ├── IRepository.cs
│   └── Repository.cs
├── Services/
│   ├── IAuthService.cs
│   ├── AuthService.cs
│   ├── ICandidateService.cs
│   ├── CandidateService.cs
│   ├── ICompanyService.cs
│   ├── CompanyService.cs
│   ├── IAdminService.cs
│   ├── AdminService.cs
│   ├── IMockTestService.cs
│   ├── MockTestService.cs
│   ├── ISupportService.cs
│   ├── SupportService.cs
│   ├── IFileStorageService.cs
│   ├── AzureBlobStorageService.cs
│   ├── IEmailService.cs
│   └── EmailService.cs
├── Validators/
│   ├── RegisterCandidateValidator.cs
│   ├── RegisterCompanyValidator.cs
│   ├── CreateJobValidator.cs
│   └── (other validators)
├── appsettings.json
├── appsettings.Development.json
├── Program.cs
└── README.md
```

## Tips for Implementation

1. **Start Small**: Implement one controller at a time, test it, then move to the next
2. **Use Swagger**: Test endpoints as you build them
3. **Follow Patterns**: Use the AuthController and AuthService as templates
4. **Error Handling**: Always return consistent ApiResponse objects
5. **Authorization**: Add proper [Authorize] attributes with roles
6. **Validation**: Validate all inputs either with FluentValidation or Data Annotations
7. **Logging**: Add logging to track errors and important events
8. **Comments**: Document complex logic and business rules

## Common Patterns

### Controller Pattern
```csharp
[HttpGet("endpoint")]
[Authorize(Roles = "Role")]
public async Task<IActionResult> MethodName()
{
    var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    var result = await _service.MethodAsync(userId);
    
    if (!result.Success)
        return BadRequest(result);
    
    return Ok(result);
}
```

### Service Pattern
```csharp
public async Task<ApiResponse<TResult>> MethodAsync(params)
{
    try
    {
        // Business logic here
        return ApiResponse<TResult>.SuccessResponse(data, message);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error message");
        return ApiResponse<TResult>.ErrorResponse(ex.Message, "ERROR_CODE");
    }
}
```

## Next Steps

1. Implement CandidateService and CandidateController
2. Test with Swagger
3. Implement CompanyService and CompanyController
4. Continue with remaining services
5. Add validators and AutoMapper
6. Write unit tests
7. Deploy to Azure/AWS

Good luck with your implementation! 🚀
