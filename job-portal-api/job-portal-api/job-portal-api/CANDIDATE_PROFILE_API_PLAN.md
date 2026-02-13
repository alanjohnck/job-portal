# Candidate Profile & Resume API Implementation Plan

## Overview
Complete API specification for candidate profile management, resume handling, work experience, education, and certifications.

---

## 1. API Endpoints Overview

### Profile Management
- `GET /api/candidate/profile` - Get candidate profile
- `PUT /api/candidate/profile` - Update candidate profile
- `PATCH /api/candidate/profile/picture` - Update profile picture
- `GET /api/candidate/profile/{candidateId}` - Get public profile (for companies)

### Resume Management
- `POST /api/candidate/resume` - Upload/update resume URL
- `DELETE /api/candidate/resume` - Remove resume
- `GET /api/candidate/resume/download` - Download resume

### Work Experience
- `GET /api/candidate/experience` - Get all experiences
- `POST /api/candidate/experience` - Add experience
- `PUT /api/candidate/experience/{id}` - Update experience
- `DELETE /api/candidate/experience/{id}` - Delete experience

### Education
- `GET /api/candidate/education` - Get all education
- `POST /api/candidate/education` - Add education
- `PUT /api/candidate/education/{id}` - Update education
- `DELETE /api/candidate/education/{id}` - Delete education

### Certifications
- `GET /api/candidate/certifications` - Get all certifications
- `POST /api/candidate/certifications` - Add certification
- `PUT /api/candidate/certifications/{id}` - Update certification
- `DELETE /api/candidate/certifications/{id}` - Delete certification

### Skills
- `PUT /api/candidate/skills` - Update skills array
- `GET /api/candidate/skills/suggestions` - Get skill suggestions

---

## 2. Database Models

### Candidate Model (Already Exists)
```csharp
public class Candidate
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string PhoneNumber { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? CurrentLocation { get; set; }
    public string? ProfilePicture { get; set; }
    public string? CurrentJobTitle { get; set; }
    public string? Education { get; set; }
    public int? ExperienceYears { get; set; }
    public string[] Skills { get; set; }
    public string? ResumeUrl { get; set; }
    public string? Bio { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? GithubUrl { get; set; }
    public string? PortfolioUrl { get; set; }
    public string? TwitterUrl { get; set; }
    public string[] PreferredJobTypes { get; set; }
    public decimal? ExpectedSalary { get; set; }
    public string[] PreferredLocations { get; set; }
    
    // Navigation
    public ICollection<WorkExperience> WorkExperiences { get; set; }
    public ICollection<Education> Educations { get; set; }
    public ICollection<Certification> Certifications { get; set; }
}
```

### New Model: WorkExperience
```csharp
public class WorkExperience
{
    public Guid Id { get; set; }
    public Guid CandidateId { get; set; }
    public string JobTitle { get; set; }
    public string CompanyName { get; set; }
    public string? Location { get; set; }
    public string? EmploymentType { get; set; } // Full-time, Part-time, Contract, Internship
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrentJob { get; set; }
    public string? Description { get; set; }
    public string[] Achievements { get; set; } = Array.Empty<string>();
    public string[] TechnologiesUsed { get; set; } = Array.Empty<string>();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation
    public Candidate Candidate { get; set; } = null!;
}
```

### New Model: Education
```csharp
public class Education
{
    public Guid Id { get; set; }
    public Guid CandidateId { get; set; }
    public string InstitutionName { get; set; }
    public string Degree { get; set; } // Bachelor's, Master's, PhD, etc.
    public string FieldOfStudy { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrentlyStudying { get; set; }
    public string? Grade { get; set; } // GPA, Percentage, etc.
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Navigation
    public Candidate Candidate { get; set; } = null!;
}
```

### New Model: Certification
```csharp
public class Certification
{
    public Guid Id { get; set; }
    public Guid CandidateId { get; set; }
    public string Name { get; set; }
    public string IssuingOrganization { get; set; }
    public DateTime IssueDate { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public string? CredentialId { get; set; }
    public string? CredentialUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Navigation
    public Candidate Candidate { get; set; } = null!;
}
```

---

## 3. DTOs

### Profile DTOs
```csharp
public class CandidateProfileDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? CurrentLocation { get; set; }
    public string? ProfilePicture { get; set; }
    public string? CurrentJobTitle { get; set; }
    public string? Education { get; set; }
    public int? ExperienceYears { get; set; }
    public string[] Skills { get; set; }
    public string? ResumeUrl { get; set; }
    public string? Bio { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? GithubUrl { get; set; }
    public string? PortfolioUrl { get; set; }
    public string? TwitterUrl { get; set; }
    public string[] PreferredJobTypes { get; set; }
    public decimal? ExpectedSalary { get; set; }
    public string[] PreferredLocations { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Related data
    public List<WorkExperienceDto> WorkExperiences { get; set; }
    public List<EducationDto> Educations { get; set; }
    public List<CertificationDto> Certifications { get; set; }
}

public class UpdateCandidateProfileRequest
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string PhoneNumber { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? CurrentLocation { get; set; }
    public string? ProfilePicture { get; set; }
    public string? CurrentJobTitle { get; set; }
    public string? Education { get; set; }
    public int? ExperienceYears { get; set; }
    public string[] Skills { get; set; }
    public string? Bio { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? GithubUrl { get; set; }
    public string? PortfolioUrl { get; set; }
    public string? TwitterUrl { get; set; }
    public string[] PreferredJobTypes { get; set; }
    public decimal? ExpectedSalary { get; set; }
    public string[] PreferredLocations { get; set; }
}
```

### Work Experience DTOs
```csharp
public class WorkExperienceDto
{
    public Guid Id { get; set; }
    public string JobTitle { get; set; }
    public string CompanyName { get; set; }
    public string? Location { get; set; }
    public string? EmploymentType { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrentJob { get; set; }
    public string? Description { get; set; }
    public string[] Achievements { get; set; }
    public string[] TechnologiesUsed { get; set; }
}

public class CreateWorkExperienceRequest
{
    public string JobTitle { get; set; }
    public string CompanyName { get; set; }
    public string? Location { get; set; }
    public string? EmploymentType { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrentJob { get; set; }
    public string? Description { get; set; }
    public string[] Achievements { get; set; }
    public string[] TechnologiesUsed { get; set; }
}

public class UpdateWorkExperienceRequest : CreateWorkExperienceRequest { }
```

### Education DTOs
```csharp
public class EducationDto
{
    public Guid Id { get; set; }
    public string InstitutionName { get; set; }
    public string Degree { get; set; }
    public string FieldOfStudy { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrentlyStudying { get; set; }
    public string? Grade { get; set; }
    public string? Description { get; set; }
}

public class CreateEducationRequest
{
    public string InstitutionName { get; set; }
    public string Degree { get; set; }
    public string FieldOfStudy { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrentlyStudying { get; set; }
    public string? Grade { get; set; }
    public string? Description { get; set; }
}

public class UpdateEducationRequest : CreateEducationRequest { }
```

### Certification DTOs
```csharp
public class CertificationDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string IssuingOrganization { get; set; }
    public DateTime IssueDate { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public string? CredentialId { get; set; }
    public string? CredentialUrl { get; set; }
}

public class CreateCertificationRequest
{
    public string Name { get; set; }
    public string IssuingOrganization { get; set; }
    public DateTime IssueDate { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public string? CredentialId { get; set; }
    public string? CredentialUrl { get; set; }
}

public class UpdateCertificationRequest : CreateCertificationRequest { }
```

### Resume DTOs
```csharp
public class UpdateResumeRequest
{
    public string ResumeUrl { get; set; }
}
```

---

## 4. Service Interface

```csharp
public interface ICandidateProfileService
{
    // Profile
    Task<ApiResponse<CandidateProfileDto>> GetProfileAsync(Guid userId);
    Task<ApiResponse<CandidateProfileDto>> GetPublicProfileAsync(Guid candidateId);
    Task<ApiResponse<CandidateProfileDto>> UpdateProfileAsync(Guid userId, UpdateCandidateProfileRequest request);
    Task<ApiResponse<string>> UpdateProfilePictureAsync(Guid userId, string pictureUrl);
    
    // Resume
    Task<ApiResponse<string>> UpdateResumeAsync(Guid userId, string resumeUrl);
    Task<ApiResponse<object>> DeleteResumeAsync(Guid userId);
    
    // Work Experience
    Task<ApiResponse<List<WorkExperienceDto>>> GetWorkExperiencesAsync(Guid userId);
    Task<ApiResponse<WorkExperienceDto>> CreateWorkExperienceAsync(Guid userId, CreateWorkExperienceRequest request);
    Task<ApiResponse<WorkExperienceDto>> UpdateWorkExperienceAsync(Guid userId, Guid experienceId, UpdateWorkExperienceRequest request);
    Task<ApiResponse<object>> DeleteWorkExperienceAsync(Guid userId, Guid experienceId);
    
    // Education
    Task<ApiResponse<List<EducationDto>>> GetEducationsAsync(Guid userId);
    Task<ApiResponse<EducationDto>> CreateEducationAsync(Guid userId, CreateEducationRequest request);
    Task<ApiResponse<EducationDto>> UpdateEducationAsync(Guid userId, Guid educationId, UpdateEducationRequest request);
    Task<ApiResponse<object>> DeleteEducationAsync(Guid userId, Guid educationId);
    
    // Certifications
    Task<ApiResponse<List<CertificationDto>>> GetCertificationsAsync(Guid userId);
    Task<ApiResponse<CertificationDto>> CreateCertificationAsync(Guid userId, CreateCertificationRequest request);
    Task<ApiResponse<CertificationDto>> UpdateCertificationAsync(Guid userId, Guid certificationId, UpdateCertificationRequest request);
    Task<ApiResponse<object>> DeleteCertificationAsync(Guid userId, Guid certificationId);
    
    // Skills
    Task<ApiResponse<string[]>> UpdateSkillsAsync(Guid userId, string[] skills);
}
```

---

## 5. Implementation Steps

### Step 1: Create Models
1. Create `Models/WorkExperience.cs`
2. Create `Models/Education.cs`
3. Create `Models/Certification.cs`
4. Update `Candidate.cs` to add navigation properties

### Step 2: Update Database Context
1. Add DbSet for WorkExperience, Education, Certification
2. Configure relationships in OnModelCreating
3. Create and run migration

### Step 3: Create DTOs
1. Create `DTOs/CandidateProfileDTOs.cs` with all profile DTOs
2. Create `DTOs/WorkExperienceDTOs.cs`
3. Create `DTOs/EducationDTOs.cs`
4. Create `DTOs/CertificationDTOs.cs`

### Step 4: Create Service
1. Create `Services/CandidateProfileService.cs`
2. Implement ICandidateProfileService interface
3. Add service registration in Program.cs

### Step 5: Create Controller
1. Create `Controllers/CandidateProfileController.cs`
2. Implement all endpoints
3. Add proper authorization [Authorize(Roles = "Candidate")]

### Step 6: Frontend Integration
1. Create API service methods in `services/api.js`
2. Create profile page components
3. Create work experience form/list components
4. Create education form/list components
5. Create certifications form/list components
6. Create resume upload component

---

## 6. API Response Examples

### GET /api/candidate/profile
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "guid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "currentLocation": "San Francisco, CA",
    "currentJobTitle": "Senior Software Engineer",
    "experienceYears": 5,
    "skills": ["React", "Node.js", "Python", "AWS"],
    "bio": "Passionate software engineer...",
    "resumeUrl": "https://...",
    "profilePicture": "https://...",
    "linkedInUrl": "https://linkedin.com/in/johndoe",
    "githubUrl": "https://github.com/johndoe",
    "workExperiences": [
      {
        "id": "guid",
        "jobTitle": "Senior Software Engineer",
        "companyName": "Tech Corp",
        "location": "San Francisco, CA",
        "employmentType": "Full-time",
        "startDate": "2021-06-01",
        "endDate": null,
        "isCurrentJob": true,
        "description": "Leading development...",
        "achievements": ["Built scalable microservices"],
        "technologiesUsed": ["React", "Node.js", "Docker"]
      }
    ],
    "educations": [
      {
        "id": "guid",
        "institutionName": "Stanford University",
        "degree": "Bachelor's",
        "fieldOfStudy": "Computer Science",
        "startDate": "2015-09-01",
        "endDate": "2019-06-01",
        "grade": "3.8 GPA"
      }
    ],
    "certifications": [
      {
        "id": "guid",
        "name": "AWS Certified Solutions Architect",
        "issuingOrganization": "Amazon Web Services",
        "issueDate": "2022-03-15",
        "expiryDate": "2025-03-15",
        "credentialUrl": "https://..."
      }
    ]
  }
}
```

---

## 7. Validation Rules

### Profile
- FirstName, LastName: Required, 2-50 chars
- PhoneNumber: Required, valid format
- Email: Valid email format
- Skills: Max 50 skills, each 2-50 chars
- Bio: Max 2000 chars
- ExperienceYears: 0-50

### Work Experience
- JobTitle: Required, 2-100 chars
- CompanyName: Required, 2-100 chars
- StartDate: Required, not in future
- EndDate: Must be after StartDate if IsCurrentJob is false
- Description: Max 2000 chars

### Education
- InstitutionName: Required, 2-200 chars
- Degree: Required
- FieldOfStudy: Required, 2-100 chars
- StartDate: Required
- EndDate: Must be after StartDate if IsCurrentlyStudying is false

### Certification
- Name: Required, 2-200 chars
- IssuingOrganization: Required, 2-200 chars
- IssueDate: Required, not in future
- ExpiryDate: Must be after IssueDate if provided

---

## 8. Security Considerations

1. **Authorization**: All endpoints require authentication
2. **Ownership Validation**: Ensure user can only modify their own profile
3. **Public Profile**: Limited data exposure for GetPublicProfileAsync
4. **File Upload**: Validate file types and sizes for resume
5. **Rate Limiting**: Limit profile updates to prevent abuse

---

## 9. Frontend Components Structure

```
pages/candidate/
  MyProfile.jsx                 # Main profile page with tabs
  components/
    ProfileHeader.jsx           # Name, photo, title, location
    ProfileBasicInfo.jsx        # Edit basic info form
    ProfileSocialLinks.jsx      # Social media links
    WorkExperienceList.jsx      # Display all experiences
    WorkExperienceForm.jsx      # Add/Edit experience
    EducationList.jsx           # Display all education
    EducationForm.jsx           # Add/Edit education
    CertificationList.jsx       # Display all certifications
    CertificationForm.jsx       # Add/Edit certification
    SkillsEditor.jsx            # Tag-based skills editor
    ResumeUpload.jsx            # Resume URL input/upload
```

---

## 10. Next Steps

1. **Review and Approve Plan**: Get confirmation on structure
2. **Create Database Models**: Implement WorkExperience, Education, Certification
3. **Run Migrations**: Add tables to database
4. **Implement Service Layer**: Build CandidateProfileService
5. **Create Controller**: Build API endpoints
6. **Test APIs**: Use Postman/Swagger
7. **Build Frontend**: Create profile management UI
8. **Integration Testing**: Test full flow

---

## Estimated Time: 8-12 hours
- Models & Migration: 1 hour
- DTOs: 1 hour
- Service Implementation: 3-4 hours
- Controller: 1-2 hours
- Testing: 1 hour
- Frontend Components: 2-3 hours
