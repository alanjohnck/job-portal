# Job Portal Backend API (.NET 8.0)

A comprehensive, production-ready Job Portal Backend API built with ASP.NET Core 8.0, featuring JWT authentication, role-based authorization, and a complete suite of endpoints for candidates, companies, and administrators.

## 🚀 Features

- ✅ **Complete Database Schema** with 12+ entities
- ✅ **JWT Authentication** with access and refresh tokens
- ✅ **Role-Based Authorization** (Candidate, Company, Admin)
- ✅ **Entity Framework Core** with SQL Server
- ✅ **Global Exception Handling**
- ✅ **Swagger/OpenAPI Documentation**
- ✅ **CORS Configuration**
- ✅ **BCrypt Password Hashing**
- ✅ **Azure Blob Storage** integration (ready)
- ✅ **Email Service** support (ready)

## 📋 Prerequisites

- .NET 8.0 SDK
- SQL Server (LocalDB, Express, or Full)
- Visual Studio 2022 or VS Code
- Azure Storage Account (optional for file uploads)

## 🛠️ Setup Instructions

### 1. Clone and Restore Packages

```bash
cd job-portal-api
dotnet restore
```

### 2. Configure Database Connection

Update `appsettings.json` with your SQL Server connection string:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=JobPortalDb;Trusted_Connection=True;MultipleActiveResultSets=true"
}
```

### 3. Create Database Migration

```bash
dotnet ef migrations add InitialCreate
```

### 4. Update Database

```bash
dotnet ef database update
```

### 5. Configure JWT Secret

**IMPORTANT**: Change the JWT secret key in `appsettings.json` to a secure random string:

```json
"JwtSettings": {
  "SecretKey": "CHANGE_THIS_TO_A_SECURE_RANDOM_STRING_AT_LEAST_32_CHARACTERS"
}
```

### 6. Run the Application

```bash
dotnet run
```

The API will be available at:
- HTTPS: `https://localhost:7XXX`
- HTTP: `http://localhost:5XXX`
- Swagger UI: `https://localhost:7XXX` (root path)

## 📚 Project Structure

```
job-portal-api/
├── Controllers/           # API Controllers
│   └── AuthController.cs
├── Data/                  # Database Context
│   └── JobPortalDbContext.cs
├── DTOs/                  # Data Transfer Objects
│   └── CommonDTOs.cs
├── Helpers/               # Helper classes
│   ├── ApiResponse.cs
│   ├── AppSettings.cs
│   └── JwtTokenHelper.cs
├── Middleware/            # Custom Middleware
│   └── GlobalExceptionMiddleware.cs
├── Models/                # Database Models
│   ├── User.cs
│   ├── Candidate.cs
│   ├── Company.cs
│   ├── Job.cs
│   ├── JobApplication.cs
│   ├── MockTest.cs
│   ├── TestResult.cs
│   ├── SavedJob.cs
│   ├── SavedCandidate.cs
│   ├── SupportTicket.cs
│   ├── AdminLog.cs
│   └── RefreshToken.cs
├── Services/              # Business Logic Services
│   ├── IAuthService.cs
│   └── AuthService.cs
├── Validators/            # FluentValidation validators (to be added)
└── Repositories/          # Repository pattern (optional)
```

## 🔐 Authentication Flow

### Register Candidate
```http
POST /api/v1/auth/register/candidate
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Use Access Token
```http
GET /api/v1/candidates/profile
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## 📊 Database Models

### Core Entities
- **User** - Base authentication table
- **Candidate** - Candidate profiles with skills and preferences
- **Company** - Company profiles with subscription details
- **Job** - Job postings with requirements and skills
- **JobApplication** - Applications with Kanban workflow
- **MockTest** - Company-scheduled assessments
- **TestResult** - Candidate test scores and rankings
- **SavedJob** - Candidate bookmarks
- **SavedCandidate** - Company bookmarks
- **SupportTicket** - Customer support tickets
- **AdminLog** - Admin action audit trail
- **RefreshToken** - Secure token management

## 🔧 Configuration

### JWT Settings
```json
"JwtSettings": {
  "SecretKey": "YourSecretKey",
  "Issuer": "JobPortalApi",
  "Audience": "JobPortalClient",
  "AccessTokenExpirationMinutes": 60,
  "RefreshTokenExpirationDays": 7
}
```

### CORS Settings
```json
"Cors": {
  "AllowedOrigins": ["http://localhost:3000", "http://localhost:4200"]
}
```

### Azure Storage (Optional)
```json
"AzureStorage": {
  "ConnectionString": "YOUR_CONNECTION_STRING",
  "ContainerName": "job-portal-files"
}
```

## 🚧 Next Steps - To Be Implemented

### Controllers to Create:
1. ✅ **AuthController** - Complete
2. ⏳ **CandidateController** - Profile, job search, applications
3. ⏳ **CompanyController** - Profile, job postings, applications management
4. ⏳ **JobController** - Public job listings
5. ⏳ **AdminController** - User/company/job management
6. ⏳ **MockTestController** - Test creation and results
7. ⏳ **SupportController** - Ticket management

### Services to Create:
1. ⏳ **CandidateService** - Candidate operations
2. ⏳ **CompanyService** - Company operations
3. ⏳ **JobService** - Job CRUD and search
4. ⏳ **ApplicationService** - Application management
5. ⏳ **MockTestService** - Test operations
6. ⏳ **FileStorageService** - Azure Blob Storage
7. ⏳ **EmailService** - Email notifications

### Additional Features:
- ⏳ **FluentValidation** - Input validation
- ⏳ **AutoMapper** - DTO mapping
- ⏳ **File Upload** endpoints
- ⏳ **Search & Filtering** with pagination
- ⏳ **Email verification** flow
- ⏳ **Password reset** flow
- ⏳ **Unit Tests**
- ⏳ **Integration Tests**

## 📖 API Documentation

Once the application is running, visit the Swagger UI at the root URL to see interactive API documentation with the ability to test endpoints directly.

## 🔒 Security Best Practices

✅ **Password Hashing** - BCrypt with salt  
✅ **JWT Tokens** - Secure token generation  
✅ **HTTPS** - Enforced in production  
✅ **CORS** - Configured for specific origins  
✅ **Input Validation** - Ready for FluentValidation  
✅ **SQL Injection** - Protected by parameterized queries  
✅ **Global Exception Handling** - Prevents information leakage  

## 🐛 Troubleshooting

### Database Connection Issues
- Verify SQL Server is running
- Check connection string format
- Ensure database permissions

### Migration Issues
```bash
# Remove last migration
dotnet ef migrations remove

# Reset database (WARNING: Deletes all data)
dotnet ef database drop
dotnet ef database update
```

### JWT Issues
- Verify SecretKey is at least 32 characters
- Check token expiration settings
- Ensure clocks are synchronized

## 📝 License

This project is provided as-is for educational and commercial purposes.

## 👥 Contributing

Contributions are welcome! Please follow the coding standards and add tests for new features.

---

**Built with ❤️ using ASP.NET Core 8.0**
