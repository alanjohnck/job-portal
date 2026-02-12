# Job Portal API Documentation

## Base URL
- **Local (HTTP)**: `http://localhost:5113/api/v1`
- **Local (HTTPS)**: `https://localhost:7059/api/v1`

## Authentication
All protected endpoints require a JWT token in the header:
`Authorization: Bearer <your_access_token>`

---

## 1. Authentication Module

### Register Candidate
**POST** `/auth/register-candidate`
- **Request Body**:
```json
{
  "email": "jane@example.com",
  "password": "Password@123",
  "firstName": "Jane",
  "lastName": "Doe",
  "phoneNumber": "1234567890"
}
```
- **Response** (200 OK):
  - Returns `success: true` and message.

### Register Company
**POST** `/auth/register-company`
- **Request Body**:
```json
{
  "email": "hr@techcorp.com",
  "password": "Password@123",
  "companyName": "TechCorp",
  "companyEmail": "contact@techcorp.com",
  "phoneNumber": "0987654321",
  "industry": "Technology"
}
```

### Login
**POST** `/auth/login`
- **Request Body**:
```json
{
  "email": "jane@example.com", 
  "password": "Password@123"
}
```
- **Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "accessToken": "ey...",
    "refreshToken": "...",
    "expiresIn": 3600,
    "user": {
      "userId": "guid...",
      "email": "jane@example.com",
      "role": "Candidate"
    }
  }
}
```

---

## 2. Candidate Module

### Get Profile
**GET** `/candidates/profile`
- **Response**: Returns full candidate profile details (Education, Skills, Experience, etc.).

### Update Profile
**PUT** `/candidates/profile`
- **Request Body**:
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "currentJobTitle": "Senior Developer",
  "skills": ["C#", ".NET", "Azure"],
  "experienceYears": 5,
  "currentLocation": "New York",
  "expectedSalary": 120000,
  "preferredLocations": ["Remote"],
  "linkedInUrl": "https://linkedin.com/in/jane"
}
```

### Search Jobs
**GET** `/candidates/jobs/search`
- **Query Params**: `keyword`, `location`, `jobType`, `minSalary`, `page`, `pageSize`
- **Example**: `/candidates/jobs/search?keyword=developer&location=remote&minSalary=100000`
- **Response**: List of jobs matching criteria.

### Apply for Job
**POST** `/candidates/jobs/{jobId}/apply`
- **Request Body**:
```json
{
  "coverLetter": "I am perfect for this role...",
  "resumeUrl": "https://storage.com/resume.pdf"
}
```

### My Applications
**GET** `/candidates/applications`
- **Response**: List of jobs the candidate has applied to, with current status.

---

## 3. Company Module

### Get Company Profile
**GET** `/companies/profile`

### Update Company Profile
**PUT** `/companies/profile`
- **Request Body**:
```json
{
  "companyName": "TechCorp Solutions",
  "description": "Leading tech provider...",
  "website": "https://techcorp.com",
  "headquarterAddress": "123 Tech Lane",
  "techStack": ["C#", "React", "Azure"]
}
```

### Post a New Job
**POST** `/companies/jobs`
- **Request Body**:
```json
{
  "title": "Senior Backend Engineer",
  "description": "We need a C# expert...",
  "jobType": "Full-time",
  "minSalary": 120000,
  "maxSalary": 160000,
  "location": "Remote",
  "isRemote": true,
  "requiredSkills": ["C#", ".NET Core", "SQL"],
  "requirements": ["5+ years exp", "BS in CS"],
  "responsibilities": ["Build APIs", "Mentor juniors"],
  "deadline": "2026-12-31"
}
```

### Delete a Job
**DELETE** `/companies/jobs/{jobId}`

### View Applications for a Job
**GET** `/companies/jobs/{jobId}/applications`
- **Query Params**: `status` (e.g., ?status=Applied)
- **Response**: List of candidates who applied, including their profile snapshot.

### Update Application Status
**PUT** `/companies/applications/{applicationId}/status`
- **Request Body**:
```json
{
  "status": "Shortlisted",  // Options: Applied, Shortlisted, Interviewing, Hired, Rejected
  "kanbanColumn": "Interview" // Optional
}
```

### Search Candidates
**GET** `/companies/candidates/search`
- **Query Params**: `keyword`, `skills`, `experienceYears`
- **Example**: `/companies/candidates/search?skills=C#&experienceYears=3`

---

## 4. Mock Test Module

### Create Mock Test (Company)
**POST** `/mock-tests`
- **Request Body**:
```json
{
  "jobId": "guid...",
  "title": "C# Technical Assessment",
  "description": "30 min multiple choice test",
  "scheduledDate": "2026-03-01T10:00:00Z",
  "startTime": "10:00:00",
  "durationMinutes": 30,
  "passingScore": 70
}
```

### Get Available Tests (Candidate)
**GET** `/mock-tests/available`

### Submit Test Result (Candidate)
**POST** `/mock-tests/{id}/submit`
- **Request Body**:
```json
{
  "score": 85
}
```
- **Response**: Returns pass/fail status.

---

## 5. Admin Module (Role: Admin)

### Dashboard Stats
**GET** `/admin/dashboard`
- **Response**: Total users, jobs, applications, revenue stats.

### User Management
**GET** `/admin/users`
- **Query Params**: `role` (e.g., Candidate/Company), `status` (Active/Inactive).

**PUT** `/admin/users/{userId}/status`
- **Request Body**: `true` (Active) or `false` (Inactive) (Send raw boolean).

### Job Moderation
**DELETE** `/admin/jobs/{jobId}`

### Support Tickets
**GET** `/admin/support-tickets`
- **Query Params**: `status` (Open/Closed), `priority`.

**PUT** `/admin/support-tickets/{ticketId}/status`
- **Request Body**: `"Closed"` (Send raw string).

---

## 6. Support Module (All Users)

### Create Ticket
**POST** `/support-tickets`
- **Request Body**:
```json
{
  "subject": "Login Issue",
  "description": "I cannot access my dashboard.",
  "priority": "High"
}
```

### My Tickets
**GET** `/support-tickets`
- **Response**: List of tickets created by the current user with their status.

---

## Dummy Data Credentials (Seeded)

Use these accounts to test:

| Role      | Email                  | Password       |
|-----------|------------------------|----------------|
| **Admin** | `admin@jobportal.com`  | `Password@123` |
| **Company**| `hr@techcorp.com`     | `Password@123` |
| **Candidate**| `jane.doe@example.com`| `Password@123` |
