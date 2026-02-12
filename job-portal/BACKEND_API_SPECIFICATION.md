# Job Portal Backend API Specification (.NET)

## Table of Contents
1. [Database Schema](#database-schema)
2. [Authentication & Authorization](#authentication--authorization)
3. [API Endpoints](#api-endpoints)
   - [Authentication APIs](#authentication-apis)
   - [Candidate APIs](#candidate-apis)
   - [Company APIs](#company-apis)
   - [Admin APIs](#admin-apis)
   - [Job APIs](#job-apis)
   - [Application APIs](#application-apis)
   - [Mock Test APIs](#mock-test-apis)
   - [Support APIs](#support-apis)

---

## Database Schema

### 1. Users (Base Authentication Table)
```csharp
public class User
{
    public Guid Id { get; set; }                    // Primary Key
    public string Email { get; set; }               // Unique, Required
    public string PasswordHash { get; set; }        // Hashed password
    public string Role { get; set; }                // "Candidate", "Company", "Admin"
    public bool IsActive { get; set; }              // Account status
    public bool IsEmailVerified { get; set; }       // Email verification status
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
}
```

### 2. Candidates
```csharp
public class Candidate
{
    public Guid Id { get; set; }                    // Primary Key
    public Guid UserId { get; set; }                // Foreign Key to Users
    public string FirstName { get; set; }           // Required
    public string LastName { get; set; }            // Required
    public string PhoneNumber { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string Gender { get; set; }              // "Male", "Female", "Other"
    public string CurrentLocation { get; set; }
    public string ProfilePicture { get; set; }      // URL/Path
    
    // Professional Info
    public string CurrentJobTitle { get; set; }
    public string Education { get; set; }           // Highest degree
    public int? ExperienceYears { get; set; }
    public string[] Skills { get; set; }            // Array of skills
    public string ResumeUrl { get; set; }           // CV/Resume file path
    public string Bio { get; set; }                 // Professional summary
    
    // Social Links
    public string LinkedInUrl { get; set; }
    public string GithubUrl { get; set; }
    public string PortfolioUrl { get; set; }
    public string TwitterUrl { get; set; }
    
    // Preferences
    public string[] PreferredJobTypes { get; set; } // "Full Time", "Part Time", "Remote", "Contract"
    public decimal? ExpectedSalary { get; set; }
    public string[] PreferredLocations { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation Properties
    public User User { get; set; }
    public ICollection<JobApplication> Applications { get; set; }
    public ICollection<SavedJob> SavedJobs { get; set; }
}
```

### 3. Companies
```csharp
public class Company
{
    public Guid Id { get; set; }                    // Primary Key
    public Guid UserId { get; set; }                // Foreign Key to Users
    public string CompanyName { get; set; }         // Required, Unique
    public string CompanyEmail { get; set; }        // Company contact email
    public string PhoneNumber { get; set; }
    public string Website { get; set; }
    
    // Company Details
    public string Industry { get; set; }            // Technology, Healthcare, etc.
    public string CompanySize { get; set; }         // "1-50", "51-200", "201-500", "500+"
    public string Description { get; set; }         // About the company
    public string Logo { get; set; }                // Logo URL/Path
    public string BannerImage { get; set; }         // Cover image
    
    // Location
    public string HeadquarterAddress { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string Country { get; set; }
    public string ZipCode { get; set; }
    
    // Social Links
    public string LinkedInUrl { get; set; }
    public string TwitterUrl { get; set; }
    public string FacebookUrl { get; set; }
    
    // Business Info
    public DateTime? Founded { get; set; }
    public string[] TechStack { get; set; }         // Technologies used
    public decimal? AnnualRevenue { get; set; }     // For admin tracking
    
    // Subscription/Billing
    public string SubscriptionPlan { get; set; }    // "Free", "Basic", "Premium", "Enterprise"
    public DateTime? SubscriptionExpiresAt { get; set; }
    public bool IsFeatured { get; set; }            // Featured company status
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation Properties
    public User User { get; set; }
    public ICollection<Job> Jobs { get; set; }
    public ICollection<SavedCandidate> SavedCandidates { get; set; }
}
```

### 4. Jobs
```csharp
public class Job
{
    public Guid Id { get; set; }                    // Primary Key
    public Guid CompanyId { get; set; }             // Foreign Key to Companies
    public string Title { get; set; }               // Required
    public string Description { get; set; }         // Rich text/HTML
    public string[] Requirements { get; set; }      // Array of requirements
    public string[] Responsibilities { get; set; }  // Array of responsibilities
    
    // Job Details
    public string JobType { get; set; }             // "Full Time", "Part Time", "Contract", "Remote"
    public string ExperienceLevel { get; set; }     // "Entry", "Mid", "Senior", "Lead"
    public decimal? MinSalary { get; set; }
    public decimal? MaxSalary { get; set; }
    public string SalaryCurrency { get; set; }      // "USD", "INR", etc.
    public string SalaryPeriod { get; set; }        // "Hourly", "Monthly", "Yearly"
    
    // Location
    public string Location { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string Country { get; set; }
    public bool IsRemote { get; set; }
    
    // Skills & Tags
    public string[] RequiredSkills { get; set; }
    public string[] Tags { get; set; }
    public string Category { get; set; }            // "Engineering", "Design", "Marketing", etc.
    
    // Status & Dates
    public string Status { get; set; }              // "Active", "Closed", "Draft"
    public DateTime? Deadline { get; set; }         // Application deadline
    public int? Openings { get; set; }              // Number of positions
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation Properties
    public Company Company { get; set; }
    public ICollection<JobApplication> Applications { get; set; }
    public ICollection<MockTest> MockTests { get; set; }
}
```

### 5. Job Applications
```csharp
public class JobApplication
{
    public Guid Id { get; set; }                    // Primary Key
    public Guid JobId { get; set; }                 // Foreign Key to Jobs
    public Guid CandidateId { get; set; }           // Foreign Key to Candidates
    
    // Application Details
    public string CoverLetter { get; set; }
    public string ResumeUrl { get; set; }           // Can override default resume
    public string Status { get; set; }              // "Applied", "Shortlisted", "Interviewed", "Offered", "Rejected"
    public string KanbanColumn { get; set; }        // For tracking in Company Kanban
    
    // Metadata
    public DateTime AppliedAt { get; set; }
    public DateTime? ViewedAt { get; set; }         // When company viewed
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation Properties
    public Job Job { get; set; }
    public Candidate Candidate { get; set; }
}
```

### 6. Mock Tests
```csharp
public class MockTest
{
    public Guid Id { get; set; }                    // Primary Key
    public Guid JobId { get; set; }                 // Foreign Key to Jobs
    public Guid CompanyId { get; set; }             // Foreign Key to Companies
    
    public string Title { get; set; }               // Required
    public string Description { get; set; }
    public DateTime ScheduledDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public int DurationMinutes { get; set; }
    public int PassingScore { get; set; }           // Percentage
    
    public string Status { get; set; }              // "Scheduled", "In Progress", "Finished"
    public int TotalApplicants { get; set; }        // Count
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation Properties
    public Job Job { get; set; }
    public Company Company { get; set; }
    public ICollection<TestResult> TestResults { get; set; }
}
```

### 7. Test Results
```csharp
public class TestResult
{
    public Guid Id { get; set; }                    // Primary Key
    public Guid MockTestId { get; set; }            // Foreign Key to MockTests
    public Guid CandidateId { get; set; }           // Foreign Key to Candidates
    
    public int Score { get; set; }                  // Out of 100
    public int Rank { get; set; }                   // Ranking among all test takers
    public bool HasPassed { get; set; }
    public DateTime CompletedAt { get; set; }
    
    // Navigation Properties
    public MockTest MockTest { get; set; }
    public Candidate Candidate { get; set; }
}
```

### 8. Saved Jobs (Candidate's Bookmarks)
```csharp
public class SavedJob
{
    public Guid Id { get; set; }                    // Primary Key
    public Guid CandidateId { get; set; }           // Foreign Key to Candidates
    public Guid JobId { get; set; }                 // Foreign Key to Jobs
    public DateTime SavedAt { get; set; }
    
    // Navigation Properties
    public Candidate Candidate { get; set; }
    public Job Job { get; set; }
}
```

### 9. Saved Candidates (Company's Bookmarks)
```csharp
public class SavedCandidate
{
    public Guid Id { get; set; }                    // Primary Key
    public Guid CompanyId { get; set; }             // Foreign Key to Companies
    public Guid CandidateId { get; set; }           // Foreign Key to Candidates
    public string Notes { get; set; }               // Company notes about candidate
    public DateTime SavedAt { get; set; }
    
    // Navigation Properties
    public Company Company { get; set; }
    public Candidate Candidate { get; set; }
}
```

### 10. Support Tickets
```csharp
public class SupportTicket
{
    public Guid Id { get; set; }                    // Primary Key
    public string TicketNumber { get; set; }        // Unique, e.g., "T-842"
    public Guid UserId { get; set; }                // Foreign Key to Users
    public string UserType { get; set; }            // "Candidate", "Company"
    
    public string Subject { get; set; }             // Required
    public string Description { get; set; }         // Issue details
    public string Priority { get; set; }            // "Low", "Medium", "High"
    public string Status { get; set; }              // "Open", "In Progress", "Closed"
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? ClosedAt { get; set; }
    
    // Navigation Properties
    public User User { get; set; }
}
```

### 11. Admin Logs (Optional - for tracking admin actions)
```csharp
public class AdminLog
{
    public Guid Id { get; set; }
    public Guid AdminUserId { get; set; }
    public string Action { get; set; }              // "Deactivated User", "Deleted Job", etc.
    public string TargetType { get; set; }          // "User", "Company", "Job"
    public Guid? TargetId { get; set; }
    public string Details { get; set; }             // JSON or text details
    public DateTime Timestamp { get; set; }
}
```

---

## Authentication & Authorization

### Authentication Strategy
- **JWT (JSON Web Tokens)** for stateless authentication
- **Role-Based Access Control (RBAC)**: Candidate, Company, Admin
- **Refresh Token** mechanism for long-lived sessions

### Token Structure
```json
{
  "userId": "guid",
  "email": "user@example.com",
  "role": "Candidate|Company|Admin",
  "exp": 1234567890
}
```

### Authorization Headers
```
Authorization: Bearer <JWT_TOKEN>
```

---

## API Endpoints

### Base URL
```
https://api.jobportal.com/api/v1
```

---

## Authentication APIs

### 1. Register Candidate
**Endpoint:** `POST /auth/register/candidate`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Candidate registered successfully. Please verify your email.",
  "data": {
    "userId": "uuid",
    "candidateId": "uuid",
    "email": "john.doe@example.com",
    "role": "Candidate"
  }
}
```

---

### 2. Register Company
**Endpoint:** `POST /auth/register/company`

**Request Body:**
```json
{
  "email": "hr@company.com",
  "password": "SecurePass123!",
  "companyName": "Tech Corp",
  "companyEmail": "contact@techcorp.com",
  "phoneNumber": "+1234567890",
  "industry": "Technology"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Company registered successfully. Please verify your email.",
  "data": {
    "userId": "uuid",
    "companyId": "uuid",
    "email": "hr@company.com",
    "role": "Company"
  }
}
```

---

### 3. Login
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt_token_here",
    "refreshToken": "refresh_token_here",
    "expiresIn": 3600,
    "user": {
      "userId": "uuid",
      "email": "user@example.com",
      "role": "Candidate",
      "isActive": true,
      "profileId": "uuid"
    }
  }
}
```

---

### 4. Refresh Token
**Endpoint:** `POST /auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_token",
    "expiresIn": 3600
  }
}
```

---

### 5. Forgot Password
**Endpoint:** `POST /auth/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset link sent to your email."
}
```

---

### 6. Reset Password
**Endpoint:** `POST /auth/reset-password`

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successfully."
}
```

---

### 7. Verify Email
**Endpoint:** `GET /auth/verify-email?token={verification_token}`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Email verified successfully."
}
```

---

## Candidate APIs

### 1. Get Candidate Profile
**Endpoint:** `GET /candidates/profile`

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "dateOfBirth": "1995-05-15",
    "gender": "Male",
    "currentLocation": "New York, NY",
    "profilePicture": "https://cdn.example.com/profiles/john.jpg",
    "currentJobTitle": "Senior Developer",
    "education": "Bachelor's in Computer Science",
    "experienceYears": 5,
    "skills": ["JavaScript", "React", "Node.js", ".NET"],
    "resumeUrl": "https://cdn.example.com/resumes/john_doe.pdf",
    "bio": "Passionate full-stack developer...",
    "linkedInUrl": "https://linkedin.com/in/johndoe",
    "githubUrl": "https://github.com/johndoe",
    "portfolioUrl": "https://johndoe.com",
    "preferredJobTypes": ["Full Time", "Remote"],
    "expectedSalary": 120000,
    "preferredLocations": ["New York", "Remote"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-03-20T14:22:00Z"
  }
}
```

---

### 2. Update Candidate Profile
**Endpoint:** `PUT /candidates/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1995-05-15",
  "currentLocation": "San Francisco, CA",
  "currentJobTitle": "Lead Developer",
  "education": "Master's in Computer Science",
  "experienceYears": 6,
  "skills": ["JavaScript", "React", "Node.js", ".NET", "Azure"],
  "bio": "Updated bio...",
  "linkedInUrl": "https://linkedin.com/in/johndoe",
  "githubUrl": "https://github.com/johndoe",
  "portfolioUrl": "https://johndoe.com",
  "preferredJobTypes": ["Full Time", "Remote"],
  "expectedSalary": 150000,
  "preferredLocations": ["San Francisco", "Remote"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully.",
  "data": { /* Updated profile object */ }
}
```

---

### 3. Upload Profile Picture
**Endpoint:** `POST /candidates/profile/picture`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `file`: Image file (JPG, PNG)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "profilePictureUrl": "https://cdn.example.com/profiles/john_doe_updated.jpg"
  }
}
```

---

### 4. Upload Resume
**Endpoint:** `POST /candidates/profile/resume`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `file`: PDF file

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "resumeUrl": "https://cdn.example.com/resumes/john_doe_updated.pdf"
  }
}
```

---

### 5. Search Jobs
**Endpoint:** `GET /candidates/jobs/search`

**Query Parameters:**
- `keyword` (optional): Search in title/description
- `location` (optional): Job location
- `jobType` (optional): Full Time, Part Time, etc.
- `experienceLevel` (optional): Entry, Mid, Senior
- `minSalary` (optional): Minimum salary
- `maxSalary` (optional): Maximum salary
- `page` (default: 1)
- `pageSize` (default: 20)

**Example:** `GET /candidates/jobs/search?keyword=developer&location=New York&jobType=Full Time&page=1`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "uuid",
        "title": "Senior Developer",
        "company": {
          "id": "uuid",
          "name": "Tech Corp",
          "logo": "https://cdn.example.com/logos/techcorp.png"
        },
        "location": "New York, NY",
        "jobType": "Full Time",
        "experienceLevel": "Senior",
        "minSalary": 100000,
        "maxSalary": 150000,
        "salaryCurrency": "USD",
        "requiredSkills": ["JavaScript", "React", ".NET"],
        "postedAt": "2024-03-15T10:00:00Z",
        "deadline": "2024-04-15T23:59:59Z",
        "applicationsCount": 45
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 20,
      "totalPages": 5,
      "totalItems": 95
    }
  }
}
```

---

### 6. Get Job Details
**Endpoint:** `GET /candidates/jobs/{jobId}`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Senior Full Stack Developer",
    "description": "<p>We are looking for...</p>",
    "requirements": [
      "5+ years of experience",
      "Proficient in React and .NET",
      "Strong problem-solving skills"
    ],
    "responsibilities": [
      "Design and develop web applications",
      "Collaborate with cross-functional teams"
    ],
    "jobType": "Full Time",
    "experienceLevel": "Senior",
    "minSalary": 120000,
    "maxSalary": 160000,
    "salaryCurrency": "USD",
    "salaryPeriod": "Yearly",
    "location": "San Francisco, CA",
    "isRemote": false,
    "requiredSkills": ["React", ".NET Core", "Azure", "SQL"],
    "tags": ["Engineering", "Full Stack"],
    "category": "Engineering",
    "status": "Active",
    "deadline": "2024-05-01T23:59:59Z",
    "openings": 3,
    "company": {
      "id": "uuid",
      "name": "Tech Innovators Inc.",
      "logo": "https://cdn.example.com/logos/techinnovators.png",
      "industry": "Technology",
      "companySize": "201-500",
      "website": "https://techinnovators.com"
    },
    "postedAt": "2024-03-10T09:00:00Z",
    "applicationsCount": 124,
    "hasApplied": false,
    "isSaved": true
  }
}
```

---

### 7. Apply for Job
**Endpoint:** `POST /candidates/jobs/{jobId}/apply`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "coverLetter": "Dear Hiring Manager, I am excited...",
  "resumeUrl": "https://cdn.example.com/resumes/custom_resume.pdf" // Optional override
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Application submitted successfully.",
  "data": {
    "applicationId": "uuid",
    "jobId": "uuid",
    "status": "Applied",
    "appliedAt": "2024-03-20T15:30:00Z"
  }
}
```

---

### 8. Get My Applications
**Endpoint:** `GET /candidates/applications`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): Applied, Shortlisted, Interviewed, Offered, Rejected
- `page` (default: 1)
- `pageSize` (default: 20)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "uuid",
        "job": {
          "id": "uuid",
          "title": "Senior Developer",
          "company": {
            "name": "Tech Corp",
            "logo": "url"
          }
        },
        "status": "Shortlisted",
        "appliedAt": "2024-03-15T10:00:00Z",
        "updatedAt": "2024-03-18T14:22:00Z"
      }
    ],
    "pagination": { /* pagination object */ }
  }
}
```

---

### 9. Save/Bookmark Job
**Endpoint:** `POST /candidates/jobs/{jobId}/save`

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Job saved successfully."
}
```

---

### 10. Unsave Job
**Endpoint:** `DELETE /candidates/jobs/{jobId}/save`

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Job removed from saved list."
}
```

---

### 11. Get Saved Jobs
**Endpoint:** `GET /candidates/jobs/saved`

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "savedJobs": [
      {
        "id": "uuid",
        "job": { /* Full job object */ },
        "savedAt": "2024-03-10T12:00:00Z"
      }
    ]
  }
}
```

---

## Company APIs

### 1. Get Company Profile
**Endpoint:** `GET /companies/profile`

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "companyName": "Tech Innovators Inc.",
    "companyEmail": "hr@techinnovators.com",
    "phoneNumber": "+1234567890",
    "website": "https://techinnovators.com",
    "industry": "Technology",
    "companySize": "201-500",
    "description": "We are a leading tech company...",
    "logo": "https://cdn.example.com/logos/techinnovators.png",
    "bannerImage": "https://cdn.example.com/banners/techinnovators.jpg",
    "headquarterAddress": "123 Tech Street",
    "city": "San Francisco",
    "state": "CA",
    "country": "USA",
    "zipCode": "94105",
    "linkedInUrl": "https://linkedin.com/company/techinnovators",
    "twitterUrl": "https://twitter.com/techinnovators",
    "founded": "2010-01-01",
    "techStack": [".NET", "React", "Azure", "SQL Server"],
    "subscriptionPlan": "Premium",
    "subscriptionExpiresAt": "2025-03-20T00:00:00Z",
    "isFeatured": true,
    "createdAt": "2020-05-10T08:00:00Z"
  }
}
```

---

### 2. Update Company Profile
**Endpoint:** `PUT /companies/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "companyName": "Tech Innovators Inc.",
  "companyEmail": "contact@techinnovators.com",
  "phoneNumber": "+1234567890",
  "website": "https://techinnovators.com",
  "industry": "Technology",
  "companySize": "201-500",
  "description": "Updated description...",
  "headquarterAddress": "123 Tech Street, Suite 500",
  "city": "San Francisco",
  "state": "CA",
  "country": "USA",
  "zipCode": "94105",
  "linkedInUrl": "https://linkedin.com/company/techinnovators",
  "twitterUrl": "https://twitter.com/techinnovators",
  "facebookUrl": "https://facebook.com/techinnovators",
  "founded": "2010-01-01",
  "techStack": [".NET Core", "React", "Azure", "MongoDB"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Company profile updated successfully.",
  "data": { /* Updated company object */ }
}
```

---

### 3. Upload Company Logo
**Endpoint:** `POST /companies/profile/logo`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `file`: Image file

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "logoUrl": "https://cdn.example.com/logos/company_updated.png"
  }
}
```

---

### 4. Upload Company Banner
**Endpoint:** `POST /companies/profile/banner`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `file`: Image file

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "bannerUrl": "https://cdn.example.com/banners/company_updated.jpg"
  }
}
```

---

### 5. Get Company Dashboard Stats
**Endpoint:** `GET /companies/dashboard/stats`

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalJobs": 12,
    "activeJobs": 8,
    "totalApplications": 450,
    "newApplicationsToday": 15,
    "profileViews": 1240
  }
}
```

---

### 6. Create Job Posting
**Endpoint:** `POST /companies/jobs`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Senior Full Stack Developer",
  "description": "<p>Rich text description...</p>",
  "requirements": [
    "5+ years experience",
    "Proficient in .NET and React"
  ],
  "responsibilities": [
    "Lead development team",
    "Design scalable architecture"
  ],
  "jobType": "Full Time",
  "experienceLevel": "Senior",
  "minSalary": 120000,
  "maxSalary": 160000,
  "salaryCurrency": "USD",
  "salaryPeriod": "Yearly",
  "location": "San Francisco, CA",
  "city": "San Francisco",
  "state": "CA",
  "country": "USA",
  "isRemote": false,
  "requiredSkills": ["React", ".NET Core", "Azure"],
  "tags": ["Engineering", "Leadership"],
  "category": "Engineering",
  "deadline": "2024-05-01T23:59:59Z",
  "openings": 2,
  "status": "Active"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Job posted successfully.",
  "data": {
    "jobId": "uuid",
    "title": "Senior Full Stack Developer",
    "status": "Active",
    "createdAt": "2024-03-20T10:00:00Z"
  }
}
```

---

### 7. Update Job Posting
**Endpoint:** `PUT /companies/jobs/{jobId}`

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (Same as Create Job)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Job updated successfully.",
  "data": { /* Updated job object */ }
}
```

---

### 8. Delete Job Posting
**Endpoint:** `DELETE /companies/jobs/{jobId}`

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Job deleted successfully."
}
```

---

### 9. Get Company's Jobs
**Endpoint:** `GET /companies/jobs`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): Active, Closed, Draft
- `page` (default: 1)
- `pageSize` (default: 20)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "uuid",
        "title": "Senior Developer",
        "status": "Active",
        "applicationsCount": 45,
        "deadline": "2024-05-01",
        "createdAt": "2024-03-01T10:00:00Z"
      }
    ],
    "pagination": { /* pagination object */ }
  }
}
```

---

### 10. Get Job Applications (for a specific job)
**Endpoint:** `GET /companies/jobs/{jobId}/applications`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): Applied, Shortlisted, Interviewed, Offered, Rejected
- `kanbanColumn` (optional): Column name for Kanban filtering

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "uuid",
        "candidate": {
          "id": "uuid",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com",
          "profilePicture": "url",
          "currentJobTitle": "Developer",
          "experienceYears": 5,
          "skills": ["React", ".NET"]
        },
        "coverLetter": "Dear Hiring Manager...",
        "resumeUrl": "url",
        "status": "Applied",
        "kanbanColumn": "All Application",
        "appliedAt": "2024-03-15T10:00:00Z"
      }
    ]
  }
}
```

---

### 11. Update Application Status
**Endpoint:** `PUT /companies/applications/{applicationId}/status`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "Shortlisted",
  "kanbanColumn": "Shortlisted"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Application status updated successfully."
}
```

---

### 12. Search Candidates
**Endpoint:** `GET /companies/candidates/search`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `keyword` (optional): Search in name, skills
- `location` (optional)
- `experienceYears` (optional): Minimum years
- `skills` (optional): Comma-separated skills

**Example:** `GET /companies/candidates/search?keyword=react&experienceYears=3&skills=React,.NET`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "candidates": [
      {
        "id": "uuid",
        "firstName": "Jane",
        "lastName": "Smith",
        "profilePicture": "url",
        "currentJobTitle": "Senior Developer",
        "experienceYears": 7,
        "skills": ["React", ".NET", "Azure"],
        "currentLocation": "San Francisco, CA",
        "expectedSalary": 140000
      }
    ],
    "pagination": { /* pagination object */ }
  }
}
```

---

### 13. Save/Bookmark Candidate
**Endpoint:** `POST /companies/candidates/{candidateId}/save`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "notes": "Excellent profile, strong in React and .NET"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Candidate saved successfully."
}
```

---

### 14. Get Saved Candidates
**Endpoint:** `GET /companies/candidates/saved`

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "savedCandidates": [
      {
        "id": "uuid",
        "candidate": { /* Full candidate object */ },
        "notes": "Excellent profile...",
        "savedAt": "2024-03-18T14:00:00Z"
      }
    ]
  }
}
```

---

### 15. Remove Saved Candidate
**Endpoint:** `DELETE /companies/candidates/{candidateId}/save`

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Candidate removed from saved list."
}
```

---

## Mock Test APIs

### 1. Create Mock Test
**Endpoint:** `POST /companies/mock-tests`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "jobId": "uuid",
  "title": "Frontend Technical Assessment",
  "description": "This test evaluates React and JavaScript proficiency",
  "scheduledDate": "2024-04-10",
  "startTime": "10:00:00",
  "durationMinutes": 60,
  "passingScore": 70
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Mock test created successfully.",
  "data": {
    "mockTestId": "uuid",
    "title": "Frontend Technical Assessment",
    "status": "Scheduled",
    "createdAt": "2024-03-20T15:00:00Z"
  }
}
```

---

### 2. Get Company's Mock Tests
**Endpoint:** `GET /companies/mock-tests`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): Scheduled, In Progress, Finished
- `jobId` (optional): Filter by job

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "mockTests": [
      {
        "id": "uuid",
        "title": "Frontend Technical Assessment",
        "job": {
          "id": "uuid",
          "title": "Senior UI/UX Designer"
        },
        "scheduledDate": "2024-04-10",
        "startTime": "10:00:00",
        "durationMinutes": 60,
        "status": "Scheduled",
        "totalApplicants": 45
      }
    ]
  }
}
```

---

### 3. Get Test Results (Top Scorers)
**Endpoint:** `GET /companies/mock-tests/{mockTestId}/results`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `topN` (optional, default: 50): Get top N candidates

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "mockTest": {
      "id": "uuid",
      "title": "Frontend Technical Assessment",
      "job": { "id": "uuid", "title": "Senior UI/UX Designer" }
    },
    "results": [
      {
        "rank": 1,
        "candidate": {
          "id": "uuid",
          "firstName": "Guy",
          "lastName": "Hawkins",
          "profilePicture": "url"
        },
        "score": 98,
        "hasPassed": true,
        "completedAt": "2024-04-10T11:45:00Z"
      }
    ]
  }
}
```

---

### 4. Update Mock Test
**Endpoint:** `PUT /companies/mock-tests/{mockTestId}`

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (Same as Create)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Mock test updated successfully."
}
```

---

### 5. Delete Mock Test
**Endpoint:** `DELETE /companies/mock-tests/{mockTestId}`

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Mock test deleted successfully."
}
```

---

## Admin APIs

### 1. Get Admin Dashboard Stats
**Endpoint:** `GET /admin/dashboard/stats`

**Headers:** `Authorization: Bearer <token>` (Admin role required)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 128430.50,
    "revenueGrowth": 12.5,
    "totalUsers": 14200,
    "userGrowth": 5.2,
    "totalCompanies": 840,
    "companyGrowth": 2.1,
    "totalJobs": 3240,
    "jobGrowth": -1.4,
    "unresolvedTickets": 12,
    "ticketsInProgress": 5,
    "resolvedTickets": 145
  }
}
```

---

### 2. Get Recent Activity
**Endpoint:** `GET /admin/dashboard/activity`

**Headers:** `Authorization: Bearer <token>` (Admin role required)

**Query Parameters:**
- `limit` (default: 20): Number of activities

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "type": "user",
        "name": "Devon Lane",
        "action": "Joined as Candidate",
        "timestamp": "2024-03-20T15:58:00Z"
      },
      {
        "type": "company",
        "name": "Nalashaa Solutions",
        "action": "Posted a new job",
        "timestamp": "2024-03-20T15:45:00Z"
      }
    ]
  }
}
```

---

### 3. Get All Users
**Endpoint:** `GET /admin/users`

**Headers:** `Authorization: Bearer <token>` (Admin role required)

**Query Parameters:**
- `role` (optional): Candidate, Company
- `status` (optional): Active, Deactivated
- `search` (optional): Search by name or email
- `page` (default: 1)
- `pageSize` (default: 20)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "userId": "uuid",
        "email": "guy.h@example.com",
        "role": "Candidate",
        "profile": {
          "id": "uuid",
          "firstName": "Guy",
          "lastName": "Hawkins"
        },
        "isActive": true,
        "createdAt": "2024-03-12T10:00:00Z"
      }
    ],
    "pagination": { /* pagination object */ }
  }
}
```

---

### 4. Deactivate User
**Endpoint:** `PUT /admin/users/{userId}/deactivate`

**Headers:** `Authorization: Bearer <token>` (Admin role required)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User account deactivated successfully."
}
```

---

### 5. Activate User
**Endpoint:** `PUT /admin/users/{userId}/activate`

**Headers:** `Authorization: Bearer <token>` (Admin role required)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User account activated successfully."
}
```

---

### 6. Get All Companies
**Endpoint:** `GET /admin/companies`

**Headers:** `Authorization: Bearer <token>` (Admin role required)

**Query Parameters:**
- `status` (optional): Active, Deactivated
- `industry` (optional)
- `search` (optional): Search by name
- `page` (default: 1)
- `pageSize` (default: 20)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "companies": [
      {
        "id": "uuid",
        "companyName": "Google",
        "industry": "Technology",
        "location": "Mountain View, CA",
        "subscriptionPlan": "Enterprise",
        "revenueGenerated": 12400.00,
        "isActive": true,
        "createdAt": "2020-05-10T08:00:00Z"
      }
    ],
    "pagination": { /* pagination object */ }
  }
}
```

---

### 7. Deactivate Company
**Endpoint:** `PUT /admin/companies/{companyId}/deactivate`

**Headers:** `Authorization: Bearer <token>` (Admin role required)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Company account deactivated successfully."
}
```

---

### 8. Activate Company
**Endpoint:** `PUT /admin/companies/{companyId}/activate`

**Headers:** `Authorization: Bearer <token>` (Admin role required)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Company account activated successfully."
}
```

---

### 9. Get All Job Postings
**Endpoint:** `GET /admin/jobs`

**Headers:** `Authorization: Bearer <token>` (Admin role required)

**Query Parameters:**
- `status` (optional): Active, Closed
- `companyId` (optional): Filter by company
- `search` (optional): Search by title
- `page` (default: 1)
- `pageSize` (default: 20)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "uuid",
        "title": "Senior UI/UX Designer",
        "company": {
          "id": "uuid",
          "name": "Nalashaa Solutions"
        },
        "jobType": "Full Time",
        "location": "Pune, India",
        "salary": "$50k-$80k",
        "applicationsCount": 124,
        "status": "Active",
        "createdAt": "2024-03-18T10:00:00Z"
      }
    ],
    "pagination": { /* pagination object */ }
  }
}
```

---

### 10. Delete Job Posting
**Endpoint:** `DELETE /admin/jobs/{jobId}`

**Headers:** `Authorization: Bearer <token>` (Admin role required)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Job posting deleted successfully."
}
```

---

### 11. Get Support Tickets
**Endpoint:** `GET /admin/support/tickets`

**Headers:** `Authorization: Bearer <token>` (Admin role required)

**Query Parameters:**
- `status` (optional): Open, In Progress, Closed
- `priority` (optional): Low, Medium, High
- `userType` (optional): Candidate, Company
- `page` (default: 1)
- `pageSize` (default: 20)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "id": "uuid",
        "ticketNumber": "T-842",
        "user": {
          "id": "uuid",
          "name": "Guy Hawkins",
          "email": "guy@example.com"
        },
        "userType": "Candidate",
        "subject": "Login Issue",
        "priority": "High",
        "status": "Open",
        "createdAt": "2024-03-20T15:40:00Z",
        "updatedAt": "2024-03-20T15:40:00Z"
      }
    ],
    "pagination": { /* pagination object */ }
  }
}
```

---

### 12. Update Ticket Status
**Endpoint:** `PUT /admin/support/tickets/{ticketId}/status`

**Headers:** `Authorization: Bearer <token>` (Admin role required)

**Request Body:**
```json
{
  "status": "In Progress"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Ticket status updated successfully."
}
```

---

### 13. Close Ticket
**Endpoint:** `PUT /admin/support/tickets/{ticketId}/close`

**Headers:** `Authorization: Bearer <token>` (Admin role required)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Ticket closed successfully."
}
```

---

## Support Ticket APIs (User-facing)

### 1. Create Support Ticket
**Endpoint:** `POST /support/tickets`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "subject": "Unable to upload resume",
  "description": "I'm getting an error when trying to upload my resume in PDF format...",
  "priority": "Medium"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Support ticket created successfully.",
  "data": {
    "ticketId": "uuid",
    "ticketNumber": "T-843",
    "status": "Open",
    "createdAt": "2024-03-20T16:00:00Z"
  }
}
```

---

### 2. Get My Tickets
**Endpoint:** `GET /support/tickets`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): Open, In Progress, Closed

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "id": "uuid",
        "ticketNumber": "T-843",
        "subject": "Unable to upload resume",
        "priority": "Medium",
        "status": "In Progress",
        "createdAt": "2024-03-20T16:00:00Z",
        "updatedAt": "2024-03-20T16:30:00Z"
      }
    ]
  }
}
```

---

## Error Response Format

All error responses follow this format:

**Response (4xx or 5xx):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Invalid input data
- `UNAUTHORIZED`: Missing or invalid authentication token
- `FORBIDDEN`: User doesn't have permission
- `NOT_FOUND`: Resource not found
- `DUPLICATE_ENTRY`: Resource already exists
- `INTERNAL_SERVER_ERROR`: Server error

---

## Pagination Format

All paginated responses include:

```json
{
  "pagination": {
    "currentPage": 1,
    "pageSize": 20,
    "totalPages": 5,
    "totalItems": 95,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## File Upload Notes

### Supported File Types
- **Profile Pictures**: JPG, PNG (Max 5MB)
- **Company Logos**: JPG, PNG, SVG (Max 5MB)
- **Banners**: JPG, PNG (Max 10MB)
- **Resumes**: PDF, DOCX (Max 5MB)

### File Storage
- Use Azure Blob Storage or AWS S3
- Return CDN URLs in responses
- Implement signed URLs for secure access

---

## Implementation Recommendations

### Technology Stack (.NET)
- **Framework**: ASP.NET Core 8.0 or later
- **ORM**: Entity Framework Core
- **Database**: SQL Server or PostgreSQL
- **Authentication**: JWT with ASP.NET Core Identity
- **File Storage**: Azure Blob Storage
- **API Documentation**: Swagger/OpenAPI

### Security Best Practices
1. Use HTTPS everywhere
2. Implement rate limiting
3. Sanitize all inputs
4. Use parameterized queries (prevent SQL injection)
5. Implement CORS properly
6. Hash passwords with bcrypt or Argon2
7. Validate JWT tokens on every protected route
8. Implement refresh token rotation

### Performance Optimization
1. Use caching (Redis) for frequently accessed data
2. Implement database indexing on search fields
3. Use pagination on all list endpoints
4. Implement lazy loading for navigation properties
5. Use async/await for I/O operations
6. Implement background jobs for email sending

### Database Indexing Recommendations
```sql
-- Users table
CREATE INDEX idx_users_email ON Users(Email);
CREATE INDEX idx_users_role ON Users(Role);

-- Jobs table
CREATE INDEX idx_jobs_company_id ON Jobs(CompanyId);
CREATE INDEX idx_jobs_status ON Jobs(Status);
CREATE INDEX idx_jobs_location ON Jobs(Location);
CREATE INDEX idx_jobs_created_at ON Jobs(CreatedAt);

-- Applications table
CREATE INDEX idx_applications_job_id ON JobApplications(JobId);
CREATE INDEX idx_applications_candidate_id ON JobApplications(CandidateId);
CREATE INDEX idx_applications_status ON JobApplications(Status);

-- Full-text search indexes for job search
CREATE FULLTEXT INDEX idx_jobs_title_description ON Jobs(Title, Description);
```

---

## Next Steps for Backend Development

1. **Set up ASP.NET Core Web API project**
2. **Configure Entity Framework Core with SQL Server**
3. **Implement Identity and JWT authentication**
4. **Create database migrations**
5. **Implement repository pattern and unit of work**
6. **Build API controllers following this specification**
7. **Add input validation with FluentValidation**
8. **Implement global error handling middleware**
9. **Set up Swagger for API documentation**
10. **Write unit and integration tests**
11. **Configure Azure Cloud services (Blob Storage, etc.)**
12. **Set up CI/CD pipeline**

---

**End of API Specification**
