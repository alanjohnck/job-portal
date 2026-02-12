using JobPortalApi.Models;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace JobPortalApi.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(JobPortalDbContext context)
    {
        // Apply migrations if needed (optional here, usually done in Program.cs)
        // await context.Database.MigrateAsync();

        if (await context.Users.AnyAsync())
        {
            return; // DB already seeded
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword("Password@123");

        // 1. Create Admin
        var admin = new User
        {
            Id = Guid.NewGuid(),
            Email = "admin@jobportal.com",
            PasswordHash = passwordHash,
            Role = "Admin", // Ensure Role matches constants or enum
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        context.Users.Add(admin);

        // 2. Create Companies
        var techCorpUser = new User
        {
            Id = Guid.NewGuid(),
            Email = "hr@techcorp.com",
            PasswordHash = passwordHash,
            Role = "Company",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        context.Users.Add(techCorpUser);

        var techCorp = new Company
        {
            Id = Guid.NewGuid(),
            UserId = techCorpUser.Id,
            CompanyName = "TechCorp Solutions",
            CompanyEmail = "contact@techcorp.com", // Distinct from login email
            PhoneNumber = "123-456-7890",
            Industry = "Technology",
            CompanySize = "50-200",
            Description = "Leading provider of cloud solutions and AI integration.",
            HeadquarterAddress = "123 Tech Park",
            City = "San Francisco",
            State = "CA",
            Country = "USA",
            Founded = new DateTime(2010, 5, 15),
            TechStack = new[] { "C#", ".NET Core", "Azure", "React" },
            SubscriptionPlan = "Premium",
            IsFeatured = true,
            CreatedAt = DateTime.UtcNow
        };
        context.Companies.Add(techCorp);

        var innovateUser = new User
        {
            Id = Guid.NewGuid(),
            Email = "jobs@innovatelabs.io",
            PasswordHash = passwordHash,
            Role = "Company",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        context.Users.Add(innovateUser);

        var innovateLabs = new Company
        {
            Id = Guid.NewGuid(),
            UserId = innovateUser.Id,
            CompanyName = "Innovate Labs",
            CompanyEmail = "hello@innovatelabs.io",
            PhoneNumber = "987-654-3210",
            Industry = "Research",
            CompanySize = "10-50",
            Description = "Pioneering research in quantum computing algorithms.",
            HeadquarterAddress = "456 Science Ave",
            City = "Boston",
            State = "MA",
            Country = "USA",
            Founded = new DateTime(2018, 9, 1),
            TechStack = new[] { "Python", "TensorFlow", "Quantum#", "Rust" },
            SubscriptionPlan = "Standard",
            CreatedAt = DateTime.UtcNow
        };
        context.Companies.Add(innovateLabs);

        // 3. Create Candidates
        var janeUser = new User
        {
            Id = Guid.NewGuid(),
            Email = "jane.doe@example.com",
            PasswordHash = passwordHash,
            Role = "Candidate",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        context.Users.Add(janeUser);

        var janeCandidate = new Candidate
        {
            Id = Guid.NewGuid(),
            UserId = janeUser.Id,
            FirstName = "Jane",
            LastName = "Doe",
            PhoneNumber = "555-0101",
            DateOfBirth = new DateTime(1995, 3, 20),
            Gender = "Female",
            CurrentLocation = "New York, NY",
            CurrentJobTitle = "Senior Software Engineer", // Ensure matches property name
            Education = "MS in Computer Science",
            ExperienceYears = 5,
            Skills = new[] { "C#", "ASP.NET Core", "SQL Server", "Docker" },
            PreferredJobTypes = new[] { "Full-time", "Remote" },
            ExpectedSalary = 120000,
            PreferredLocations = new[] { "Remote", "New York" },
            CreatedAt = DateTime.UtcNow
        };
        context.Candidates.Add(janeCandidate);

        var johnUser = new User
        {
            Id = Guid.NewGuid(),
            Email = "john.smith@example.com",
            PasswordHash = passwordHash,
            Role = "Candidate",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        context.Users.Add(johnUser);

        var johnCandidate = new Candidate
        {
            Id = Guid.NewGuid(),
            UserId = johnUser.Id,
            FirstName = "John",
            LastName = "Smith",
            PhoneNumber = "555-0202",
            DateOfBirth = new DateTime(1998, 7, 12),
            Gender = "Male",
            CurrentLocation = "Austin, TX", // Simplified
            CurrentJobTitle = "Frontend Developer",
            Education = "BS in Software Engineering",
            ExperienceYears = 3,
            Skills = new[] { "React", "TypeScript", "Tailwind CSS", "Node.js" },
            PreferredJobTypes = new[] { "Full-time" },
            ExpectedSalary = 95000,
            PreferredLocations = new[] { "Austin", "Remote" },
            CreatedAt = DateTime.UtcNow
        };
        context.Candidates.Add(johnCandidate);

        // 4. Create Jobs
        var job1 = new Job
        {
            Id = Guid.NewGuid(),
            CompanyId = techCorp.Id,
            Title = "Senior Backend Developer",
            Description = "We are looking for an experienced .NET developer to lead our backend team.",
            Requirements = new[] { "5+ years C# experience", "Experience with microservices", "Strong SQL knowledge" },
            Responsibilities = new[] { "Design scalable APIs", " mentor junior devs", "Code review" },
            JobType = "Full-time",
            ExperienceLevel = "Senior",
            MinSalary = 130000,
            MaxSalary = 160000,
            Location = "Remote", // Match property name
            IsRemote = true,
            RequiredSkills = new[] { "C#", ".NET Core", "Azure" },
            Tags = new[] { "Backend", "Senior", "Remote" },
            Status = "Active",
            CreatedAt = DateTime.UtcNow
        };
        context.Jobs.Add(job1);

        var job2 = new Job
        {
            Id = Guid.NewGuid(),
            CompanyId = techCorp.Id,
            Title = "DevOps Engineer",
            Description = "Join our platform engineering team to build robust CI/CD pipelines.",
            Requirements = new[] { "Docker/Kubernetes mastery", "Azure DevOps pipelines", "IaC (Terraform)" },
            Responsibilities = new[] { "Manage cloud infrastructure", "Automate deployments", "Ensure strict security" },
            JobType = "Contract",
            ExperienceLevel = "Mid-Level",
            MinSalary = 100000,
            MaxSalary = 140000,
            Location = "San Francisco, CA",
            IsRemote = false,
            RequiredSkills = new[] { "Docker", "Kubernetes", "Azure" },
            Tags = new[] { "DevOps", "Cloud", "Contract" },
            Status = "Active",
            CreatedAt = DateTime.UtcNow
        };
        context.Jobs.Add(job2);

        var job3 = new Job
        {
            Id = Guid.NewGuid(),
            CompanyId = innovateLabs.Id,
            Title = "Research Scientist (Quantum)",
            Description = "Conduct groundbreaking research in quantum algorithms.",
            Requirements = new[] { "PhD in Physics/CS", "Quantum computing experience", "Python proficiency" },
            Responsibilities = new[] { "Develop novel algorithms", "Publish papers", "Collaborate with industry partners" },
            JobType = "Full-time",
            ExperienceLevel = "Expert",
            MinSalary = 150000,
            MaxSalary = 200000,
            Location = "Boston, MA",
            IsRemote = false,
            RequiredSkills = new[] { "Python", "Quantum Physics", "Math" },
            Tags = new[] { "Research", "Quantum", "Science" },
            Status = "Active",
            CreatedAt = DateTime.UtcNow
        };
        context.Jobs.Add(job3);

        // 5. Create Applications
        var app1 = new JobApplication
        {
            Id = Guid.NewGuid(),
            JobId = job1.Id,
            CandidateId = janeCandidate.Id,
            Status = "Applied",
            CoverLetter = "I am highly interested in this role and have extensive .NET experience.",
            AppliedAt = DateTime.UtcNow.AddDays(-2)
        };
        context.JobApplications.Add(app1);

        var app2 = new JobApplication
        {
            Id = Guid.NewGuid(),
            JobId = job1.Id,
            CandidateId = johnCandidate.Id,
            Status = "Rejected", // John applied but rejected (wrong fit)
            CoverLetter = "Looking to transition to backend.",
            AppliedAt = DateTime.UtcNow.AddDays(-5)
        };
        context.JobApplications.Add(app2);

        // 6. Support Ticket
        var ticket = new SupportTicket
        {
            Id = Guid.NewGuid(),
            UserId = janeUser.Id,
            TicketNumber = Guid.NewGuid().ToString().Substring(0, 8).ToUpper(),
            Subject = "Issue with profile update",
            Description = "I cannot update my skills list properly.",
            Priority = "Medium",
            Status = "Open",
            CreatedAt = DateTime.UtcNow.AddHours(-4)
        };
        context.SupportTickets.Add(ticket);
        
        // 7. Admin Log (Optional - requires migration fit)
        // Since we modified AdminLog model, let's create a log entry if Admin exists
        // But AdminLog requires AdminUserId which is FK to User.
        var log = new AdminLog
        {
            Id = Guid.NewGuid(),
            AdminUserId = admin.Id,
            Action = "System Initialization",
            TargetType = "System",
            Details = "Initial data seeding completed.",
            Timestamp = DateTime.UtcNow
        };
        context.AdminLogs.Add(log);

        await context.SaveChangesAsync();
    }
}
