using JobPortalApi.Models;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace JobPortalApi.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(JobPortalDbContext context)
    {
        var passwordHash = BCrypt.Net.BCrypt.HashPassword("Password@123");

        // 1. Create Admin
        if (!await context.Users.AnyAsync(u => u.Email == "admin@jobportal.com"))
        {
            var admin = new User
            {
                Id = Guid.NewGuid(),
                Email = "admin@jobportal.com",
                PasswordHash = passwordHash,
                Role = "Admin",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            context.Users.Add(admin);
            
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
        }

        // 2. Create Companies and their Jobs
        await SeedCompanyOne(context, passwordHash);
        await SeedCompanyTwo(context, passwordHash);
        await SeedCompanyThree(context, passwordHash); // FinTech
        await SeedCompanyFour(context, passwordHash); // HealthPlus
        await SeedCompanyFive(context, passwordHash); // Creative
        await SeedCompanySix(context, passwordHash); // Retail
        await SeedCompanySeven(context, passwordHash); // Security

        // 3. Create Candidates
        await SeedCandidates(context, passwordHash);

        // 4. Backfill Categories for existing jobs (Fix for missing filter data)
        await BackfillCategories(context);

        await context.SaveChangesAsync();
    }

    private static async Task BackfillCategories(JobPortalDbContext context)
    {
        var jobs = await context.Jobs.Where(j => j.Category == null || j.Category == "").ToListAsync();
        if (!jobs.Any()) return;

        foreach (var job in jobs)
        {
            if (job.Title.Contains("Design") || job.Title.Contains("Creative") || job.Tags.Contains("Design"))
                job.Category = "Design";
            else if (job.Title.Contains("Finance") || job.Title.Contains("Quant") || job.Tags.Contains("Finance"))
                job.Category = "Finance & Accounting";
            else if (job.Title.Contains("Product Manager") || job.Title.Contains("Business"))
                job.Category = "Business";
            else if (job.Title.Contains("Marketing"))
                job.Category = "Marketing";
            else if (job.Title.Contains("Developer") || job.Title.Contains("Engineer") || job.Title.Contains("Scientist") || job.Title.Contains("Tester"))
                job.Category = "IT & Software";
            else
                job.Category = "Developments"; // Fallback
        }
        // SaveChanges is called in SeedAsync
    }

    private static async Task SeedCompanyOne(JobPortalDbContext context, string passwordHash)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == "hr@techcorp.com");
        if (user == null)
        {
            user = new User { Id = Guid.NewGuid(), Email = "hr@techcorp.com", PasswordHash = passwordHash, Role = "Company", IsActive = true, CreatedAt = DateTime.UtcNow };
            context.Users.Add(user);
        }
        else if (await context.Companies.AnyAsync(c => c.UserId == user.Id)) return;

        var company = new Company
        {
            Id = Guid.NewGuid(), UserId = user.Id, CompanyName = "TechCorp Solutions",
            CompanyEmail = "contact@techcorp.com", PhoneNumber = "123-456-7890", Industry = "Technology",
            CompanySize = "50-200", Description = "Leading provider of cloud solutions and AI integration.",
            HeadquarterAddress = "123 Tech Park", City = "San Francisco", State = "CA", Country = "USA",
            Founded = new DateTime(2010, 5, 15), TechStack = new[] { "C#", ".NET Core", "Azure", "React" },
            SubscriptionPlan = "Premium", IsFeatured = true, CreatedAt = DateTime.UtcNow,
            Logo = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7tAXCOWBmHNg8fGT_zKm4F7x8KQEkK_WX4A&s",
            BannerImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7tAXCOWBmHNg8fGT_zKm4F7x8KQEkK_WX4A&s"
        };
        context.Companies.Add(company);

        var job1 = new Job
        {
            Id = Guid.NewGuid(), CompanyId = company.Id, Title = "Senior Backend Developer",
            Description = "We are looking for an experienced .NET developer to lead our backend team.",
            Requirements = new[] { "5+ years C# experience", "Experience with microservices", "Strong SQL knowledge" },
            Responsibilities = new[] { "Design scalable APIs", "Mentor junior devs", "Code review" },
            JobType = "Full-time", ExperienceLevel = "Senior", MinSalary = 130000, MaxSalary = 160000,
            Location = "Remote", IsRemote = true, RequiredSkills = new[] { "C#", ".NET Core", "Azure" },
            Tags = new[] { "Backend", "Senior", "Remote" }, Category = "IT & Software", Status = "Active", CreatedAt = DateTime.UtcNow
        };
        context.Jobs.Add(job1);

        var job2 = new Job
        {
            Id = Guid.NewGuid(), CompanyId = company.Id, Title = "DevOps Engineer",
            Description = "Join our platform engineering team to build robust CI/CD pipelines.",
            Requirements = new[] { "Docker/Kubernetes mastery", "Azure DevOps pipelines", "IaC (Terraform)" },
            Responsibilities = new[] { "Manage cloud infrastructure", "Automate deployments", "Ensure strict security" },
            JobType = "Contract", ExperienceLevel = "Mid-Level", MinSalary = 100000, MaxSalary = 140000,
            Location = "San Francisco, CA", IsRemote = false, RequiredSkills = new[] { "Docker", "Kubernetes", "Azure" },
            Tags = new[] { "DevOps", "Cloud", "Contract" }, Category = "IT & Software", Status = "Active", CreatedAt = DateTime.UtcNow
        };
        context.Jobs.Add(job2);

        // Mock Test
        var mockTest = new MockTest
        {
            Id = Guid.NewGuid(), CompanyId = company.Id, JobId = job1.Id,
            Title = "Backend Development Assessment", Description = "A comprehensive test covering C#, SQL, and System Design.",
            ScheduledDate = DateTime.UtcNow.AddDays(5), StartTime = new TimeSpan(10, 0, 0), DurationMinutes = 60,
            PassingScore = 70, Status = "Scheduled", CreatedAt = DateTime.UtcNow
        };
        context.MockTests.Add(mockTest);

        var q1 = new TestQuestion { Id = Guid.NewGuid(), MockTestId = mockTest.Id, QuestionText = "What is the difference between IEnumerable and IQueryable?", Points = 10, OrderNumber = 1 };
        context.TestQuestions.Add(q1);
        context.TestQuestionOptions.AddRange(
            new TestQuestionOption { Id = Guid.NewGuid(), TestQuestionId = q1.Id, OptionText = "IQueryable executes query in database, IEnumerable in memory", IsCorrect = true, OrderNumber = 1 },
            new TestQuestionOption { Id = Guid.NewGuid(), TestQuestionId = q1.Id, OptionText = "They are the same", IsCorrect = false, OrderNumber = 2 },
            new TestQuestionOption { Id = Guid.NewGuid(), TestQuestionId = q1.Id, OptionText = "IEnumerable is for SQL databases only", IsCorrect = false, OrderNumber = 3 }
        );
    }

    private static async Task SeedCompanyTwo(JobPortalDbContext context, string passwordHash)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == "jobs@innovatelabs.io");
        if (user == null)
        {
            user = new User { Id = Guid.NewGuid(), Email = "jobs@innovatelabs.io", PasswordHash = passwordHash, Role = "Company", IsActive = true, CreatedAt = DateTime.UtcNow };
            context.Users.Add(user);
        }
        else if (await context.Companies.AnyAsync(c => c.UserId == user.Id)) return;

        var company = new Company
        {
            Id = Guid.NewGuid(), UserId = user.Id, CompanyName = "Innovate Labs",
            CompanyEmail = "hello@innovatelabs.io", PhoneNumber = "987-654-3210", Industry = "Research",
            CompanySize = "10-50", Description = "Pioneering research in quantum computing algorithms.",
            HeadquarterAddress = "456 Science Ave", City = "Boston", State = "MA", Country = "USA",
            Founded = new DateTime(2018, 9, 1), TechStack = new[] { "Python", "TensorFlow", "Quantum#", "Rust" },
            SubscriptionPlan = "Standard", CreatedAt = DateTime.UtcNow,
            Logo = "https://cdn.dribbble.com/userupload/26694182/file/original-dc8c625e7aadcaec7cc34cd02b6ea171.jpg?resize=400x0",
            BannerImage = "https://cdn.dribbble.com/userupload/26694182/file/original-dc8c625e7aadcaec7cc34cd02b6ea171.jpg?resize=400x0"
        };
        context.Companies.Add(company);

        var job = new Job
        {
            Id = Guid.NewGuid(), CompanyId = company.Id, Title = "Research Scientist (Quantum)",
            Description = "Conduct groundbreaking research in quantum algorithms.",
            Requirements = new[] { "PhD in Physics/CS", "Quantum computing experience", "Python proficiency" },
            Responsibilities = new[] { "Develop novel algorithms", "Publish papers", "Collaborate with industry partners" },
            JobType = "Full-time", ExperienceLevel = "Expert", MinSalary = 150000, MaxSalary = 200000,
            Location = "Boston, MA", IsRemote = false, RequiredSkills = new[] { "Python", "Quantum Physics", "Math" },
            Tags = new[] { "Research", "Quantum", "Science" }, Category = "Developments", Status = "Active", CreatedAt = DateTime.UtcNow
        };
        context.Jobs.Add(job);
    }

    private static async Task SeedCompanyThree(JobPortalDbContext context, string passwordHash)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == "hr@fintechglobal.com");
        if (user == null)
        {
            user = new User { Id = Guid.NewGuid(), Email = "hr@fintechglobal.com", PasswordHash = passwordHash, Role = "Company", IsActive = true, CreatedAt = DateTime.UtcNow };
            context.Users.Add(user);
        }
        else if (await context.Companies.AnyAsync(c => c.UserId == user.Id)) return;

        var company = new Company
        {
            Id = Guid.NewGuid(), UserId = user.Id, CompanyName = "FinTech Global",
            CompanyEmail = "careers@fintechglobal.com", PhoneNumber = "212-555-0199", Industry = "Finance",
            CompanySize = "500-1000", Description = "Revolutionizing global payments with blockchain technology.",
            HeadquarterAddress = "88 Wall St", City = "New York", State = "NY", Country = "USA",
            Founded = new DateTime(2005, 1, 1), TechStack = new[] { "Java", "Spring Boot", "Blockchain", "React" },
            SubscriptionPlan = "Premium", CreatedAt = DateTime.UtcNow,
            Logo = "https://mir-s3-cdn-cf.behance.net/projects/404/80440e173273301.Y3JvcCwyNDk5LDE5NTUsMCww.jpg",
            BannerImage = "https://mir-s3-cdn-cf.behance.net/projects/404/80440e173273301.Y3JvcCwyNDk5LDE5NTUsMCww.jpg"
        };
        context.Companies.Add(company);

        context.Jobs.AddRange(
            new Job
            {
                Id = Guid.NewGuid(), CompanyId = company.Id, Title = "Senior Java Developer",
                Description = "Build high-frequency trading platforms.",
                Requirements = new[] { "8+ years Java", "Low latency systems", "Multithreading" },
                Responsibilities = new[] { "Optimize trading engine", "Reduce latency", "Architecture design" },
                JobType = "Full-time", ExperienceLevel = "Senior", MinSalary = 180000, MaxSalary = 250000,
                Location = "New York, NY", IsRemote = false, RequiredSkills = new[] { "Java", "Spring", "Kafka" },
                Tags = new[] { "Finance", "Trading", "High Performance" }, Category = "IT & Software", Status = "Active", CreatedAt = DateTime.UtcNow
            },
            new Job
            {
                Id = Guid.NewGuid(), CompanyId = company.Id, Title = "Quantitative Analyst",
                Description = "Develop mathematical models for risk management.",
                Requirements = new[] { "PhD in Math/Stats", "Python/R", "Financial modeling" },
                Responsibilities = new[] { "Analyze market trends", "Build risk models", "Data visualization" },
                JobType = "Full-time", ExperienceLevel = "Mid-Level", MinSalary = 140000, MaxSalary = 190000,
                Location = "Remote", IsRemote = true, RequiredSkills = new[] { "Python", "Statistics", "R" },
                Tags = new[] { "Quant", "Data", "Finance" }, Category = "Finance & Accounting", Status = "Active", CreatedAt = DateTime.UtcNow
            }
        );
    }

    private static async Task SeedCompanyFour(JobPortalDbContext context, string passwordHash)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == "careers@healthplus.com");
        if (user == null)
        {
            user = new User { Id = Guid.NewGuid(), Email = "careers@healthplus.com", PasswordHash = passwordHash, Role = "Company", IsActive = true, CreatedAt = DateTime.UtcNow };
            context.Users.Add(user);
        }
        else if (await context.Companies.AnyAsync(c => c.UserId == user.Id)) return;

        var company = new Company
        {
            Id = Guid.NewGuid(), UserId = user.Id, CompanyName = "HealthPlus Systems",
            CompanyEmail = "info@healthplus.com", PhoneNumber = "617-555-0123", Industry = "Healthcare",
            CompanySize = "1000+", Description = "Digital health solutions improving patient outcomes.",
            HeadquarterAddress = "1 Medical Center Dr", City = "Boston", State = "MA", Country = "USA",
            Founded = new DateTime(1998, 4, 12), TechStack = new[] { "Angular", ".NET", "SQL Server", "Azure" },
            SubscriptionPlan = "Enterprise", CreatedAt = DateTime.UtcNow,
            Logo = "https://images.scalebranding.com/modern-tech-logo-cff9aa02-7818-44f3-961b-7d1427a1bc25.jpg",
            BannerImage = "https://images.scalebranding.com/modern-tech-logo-cff9aa02-7818-44f3-961b-7d1427a1bc25.jpg"
        };
        context.Companies.Add(company);

        context.Jobs.AddRange(
            new Job
            {
                Id = Guid.NewGuid(), CompanyId = company.Id, Title = "Clinical Data Scientist",
                Description = "Analyze clinical trial data to support drug development.",
                Requirements = new[] { "MS in Data Science", "Healthcare experience", "SQL/Python" },
                Responsibilities = new[] { "Data cleaning", "Statistical analysis", "Reporting" },
                JobType = "Full-time", ExperienceLevel = "Mid-Level", MinSalary = 110000, MaxSalary = 145000,
                Location = "Boston, MA", IsRemote = false, RequiredSkills = new[] { "Python", "SQL", "Statistics" },
                Tags = new[] { "Healthcare", "Data", "Science" }, Category = "IT & Software", Status = "Active", CreatedAt = DateTime.UtcNow
            },
            new Job
            {
                Id = Guid.NewGuid(), CompanyId = company.Id, Title = "Frontend Developer (Angular)",
                Description = "Build intuitive interfaces for doctors and patients.",
                Requirements = new[] { "3+ years Angular", "TypeScript", "RxJS" },
                Responsibilities = new[] { "Develop patient portal", "Ensure accessibility", "Optimize performance" },
                JobType = "Contract", ExperienceLevel = "Mid-Level", MinSalary = 90000, MaxSalary = 120000,
                Location = "Remote", IsRemote = true, RequiredSkills = new[] { "Angular", "TypeScript", "HTML/CSS" },
                Tags = new[] { "Frontend", "Healthcare", "Angular" }, Category = "IT & Software", Status = "Active", CreatedAt = DateTime.UtcNow
            }
        );
    }

    private static async Task SeedCompanyFive(JobPortalDbContext context, string passwordHash)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == "jobs@creativestudio.com");
        if (user == null)
        {
            user = new User { Id = Guid.NewGuid(), Email = "jobs@creativestudio.com", PasswordHash = passwordHash, Role = "Company", IsActive = true, CreatedAt = DateTime.UtcNow };
            context.Users.Add(user);
        }
        else if (await context.Companies.AnyAsync(c => c.UserId == user.Id)) return;

        var company = new Company
        {
            Id = Guid.NewGuid(), UserId = user.Id, CompanyName = "Creative Studio X",
            CompanyEmail = "hello@creativestudio.com", PhoneNumber = "310-555-0888", Industry = "Design",
            CompanySize = "10-50", Description = "Award-winning digital design agency.",
            HeadquarterAddress = "45 Arts District", City = "Los Angeles", State = "CA", Country = "USA",
            Founded = new DateTime(2015, 6, 20), TechStack = new[] { "Figma", "Adobe CC", "React", "Three.js" },
            SubscriptionPlan = "Standard", CreatedAt = DateTime.UtcNow,
            Logo = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6U4l9J2sfzObMkooAeb8SNHDXvgJ7ye8nyw&s",
            BannerImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6U4l9J2sfzObMkooAeb8SNHDXvgJ7ye8nyw&s"
        };
        context.Companies.Add(company);

        context.Jobs.AddRange(
            new Job
            {
                Id = Guid.NewGuid(), CompanyId = company.Id, Title = "Senior UI/UX Designer",
                Description = "Create stunning digital experiences for top brands.",
                Requirements = new[] { "strong portfolio", "Figma mastery", "User research" },
                Responsibilities = new[] { "Lead design sprints", "Prototype interfaces", "Mentor juniors" },
                JobType = "Full-time", ExperienceLevel = "Senior", MinSalary = 120000, MaxSalary = 160000,
                Location = "Los Angeles, CA", IsRemote = true, RequiredSkills = new[] { "Figma", "UI Design", "UX Research" },
                Tags = new[] { "Design", "Creative", "UI/UX" }, Category = "Design", Status = "Active", CreatedAt = DateTime.UtcNow
            },
            new Job
            {
                Id = Guid.NewGuid(), CompanyId = company.Id, Title = "Creative Developer",
                Description = "Bridge the gap between design and engineering with WebGL.",
                Requirements = new[] { "Three.js", "React", "GLSL" },
                Responsibilities = new[] { "Build immersive microsites", "Optimize animations", "Collaborate with designers" },
                JobType = "Contract", ExperienceLevel = "Expert", MinSalary = 100000, MaxSalary = 150000,
                Location = "Remote", IsRemote = true, RequiredSkills = new[] { "JavaScript", "WebGL", "Animation" },
                Tags = new[] { "Frontend", "Creative", "3D" }, Category = "Design", Status = "Active", CreatedAt = DateTime.UtcNow
            }
        );
    }

    private static async Task SeedCompanySix(JobPortalDbContext context, string passwordHash)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == "hiring@nextgenretail.com");
        if (user == null)
        {
            user = new User { Id = Guid.NewGuid(), Email = "hiring@nextgenretail.com", PasswordHash = passwordHash, Role = "Company", IsActive = true, CreatedAt = DateTime.UtcNow };
            context.Users.Add(user);
        }
        else if (await context.Companies.AnyAsync(c => c.UserId == user.Id)) return;

        var company = new Company
        {
            Id = Guid.NewGuid(), UserId = user.Id, CompanyName = "NextGen Retail",
            CompanyEmail = "corp@nextgenretail.com", PhoneNumber = "206-555-0999", Industry = "E-commerce",
            CompanySize = "200-500", Description = "The future of online shopping.",
            HeadquarterAddress = "500 Commerce Way", City = "Seattle", State = "WA", Country = "USA",
            Founded = new DateTime(2012, 11, 11), TechStack = new[] { "Node.js", "React", "MongoDB", "AWS" },
            SubscriptionPlan = "Premium", CreatedAt = DateTime.UtcNow,
            Logo = "https://static.vecteezy.com/system/resources/thumbnails/007/619/674/small/modern-hexagon-tech-logo-designs-concept-hexa-technology-logo-template-vector.jpg",
            BannerImage = "https://static.vecteezy.com/system/resources/thumbnails/007/619/674/small/modern-hexagon-tech-logo-designs-concept-hexa-technology-logo-template-vector.jpg"
        };
        context.Companies.Add(company);

        context.Jobs.AddRange(
            new Job
            {
                Id = Guid.NewGuid(), CompanyId = company.Id, Title = "Full Stack Developer (MERN)",
                Description = "Scale our e-commerce platform to millions of users.",
                Requirements = new[] { "Node.js", "React", "MongoDB scaling" },
                Responsibilities = new[] { "Build REST APIs", "Develop frontend features", "Database optimization" },
                JobType = "Full-time", ExperienceLevel = "Mid-Level", MinSalary = 115000, MaxSalary = 145000,
                Location = "Seattle, WA", IsRemote = false, RequiredSkills = new[] { "Node.js", "React", "MongoDB" },
                Tags = new[] { "Full Stack", "Ecommerce", "Web" }, Category = "IT & Software", Status = "Active", CreatedAt = DateTime.UtcNow
            },
            new Job
            {
                Id = Guid.NewGuid(), CompanyId = company.Id, Title = "Product Manager",
                Description = "Define the roadmap for our mobile app.",
                Requirements = new[] { "3+ years PM experience", "Agile", "User-centric" },
                Responsibilities = new[] { "Prioritize backlog", "Stakeholder management", "Launch features" },
                JobType = "Full-time", ExperienceLevel = "Senior", MinSalary = 130000, MaxSalary = 170000,
                Location = "Remote", IsRemote = true, RequiredSkills = new[] { "Product Management", "Agile", "Jira" },
                Tags = new[] { "Product", "Management", "Mobile" }, Category = "Business", Status = "Active", CreatedAt = DateTime.UtcNow
            }
        );
    }

    private static async Task SeedCompanySeven(JobPortalDbContext context, string passwordHash)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == "recruit@securenet.com");
        if (user == null)
        {
            user = new User { Id = Guid.NewGuid(), Email = "recruit@securenet.com", PasswordHash = passwordHash, Role = "Company", IsActive = true, CreatedAt = DateTime.UtcNow };
            context.Users.Add(user);
        }
        else if (await context.Companies.AnyAsync(c => c.UserId == user.Id)) return;

        var company = new Company
        {
            Id = Guid.NewGuid(), UserId = user.Id, CompanyName = "SecureNet Defense",
            CompanyEmail = "security@securenet.com", PhoneNumber = "703-555-0444", Industry = "Cybersecurity",
            CompanySize = "100-200", Description = "Protecting critical infrastructure from cyber threats.",
            HeadquarterAddress = "100 Defense Dr", City = "Arlington", State = "VA", Country = "USA",
            Founded = new DateTime(2016, 2, 28), TechStack = new[] { "Python", "C++", "Linux", "Splunk" },
            SubscriptionPlan = "Premium", CreatedAt = DateTime.UtcNow,
            Logo = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7tAXCOWBmHNg8fGT_zKm4F7x8KQEkK_WX4A&s",
            BannerImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7tAXCOWBmHNg8fGT_zKm4F7x8KQEkK_WX4A&s"
        };
        context.Companies.Add(company);

        context.Jobs.AddRange(
            new Job
            {
                Id = Guid.NewGuid(), CompanyId = company.Id, Title = "Security Analyst",
                Description = "Monitor and respond to security incidents.",
                Requirements = new[] { "SOC experience", "SIEM tools", "Incident response" },
                Responsibilities = new[] { "Analyze logs", "Investigate alerts", "Write reports" },
                JobType = "Full-time", ExperienceLevel = "Entry-Level", MinSalary = 75000, MaxSalary = 95000,
                Location = "Arlington, VA", IsRemote = false, RequiredSkills = new[] { "Cybersecurity", "Splunk", "Linux" },
                Tags = new[] { "Security", "Analyst", "SOC" }, Category = "IT & Software", Status = "Active", CreatedAt = DateTime.UtcNow
            },
            new Job
            {
                Id = Guid.NewGuid(), CompanyId = company.Id, Title = "Penetration Tester",
                Description = "Ethical hacking to identify vulnerabilities.",
                Requirements = new[] { "OSCP certification", "Web app security", "Network pentesting" },
                Responsibilities = new[] { "Perform pentests", "Exploit vulnerabilities", "Remediation advice" },
                JobType = "Contract", ExperienceLevel = "Senior", MinSalary = 120000, MaxSalary = 180000,
                Location = "Remote", IsRemote = true, RequiredSkills = new[] { "Hacking", "Burp Suite", "Python" },
                Tags = new[] { "Security", "Pentest", "Red Team" }, Category = "IT & Software", Status = "Active", CreatedAt = DateTime.UtcNow
            }
        );
    }

    private static async Task SeedCandidates(JobPortalDbContext context, string passwordHash)
    {
        if (!await context.Users.AnyAsync(u => u.Email == "jane.doe@example.com"))
        {
            var userId = Guid.NewGuid();
            var user = new User { Id = userId, Email = "jane.doe@example.com", PasswordHash = passwordHash, Role = "Candidate", IsActive = true, CreatedAt = DateTime.UtcNow };
            context.Users.Add(user);
            var janeCandidate = new Candidate
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                FirstName = "Jane",
                LastName = "Doe",
                PhoneNumber = "555-0101",
                DateOfBirth = new DateTime(1995, 3, 20),
                Gender = "Female",
                CurrentLocation = "New York, NY",
                CurrentJobTitle = "Senior Software Engineer",
                Education = "MS in Computer Science",
                ExperienceYears = 5,
                Skills = new[] { "C#", "ASP.NET Core", "SQL Server", "Docker" },
                PreferredJobTypes = new[] { "Full-time", "Remote" },
                ExpectedSalary = 120000,
                PreferredLocations = new[] { "Remote", "New York" },
                Bio = "Experienced .NET Developer with a passion for building scalable web applications.",
                CreatedAt = DateTime.UtcNow,
                WorkExperiences = new List<WorkExperience>
                {
                    new WorkExperience
                    {
                        Id = Guid.NewGuid(),
                        JobTitle = "Senior Software Engineer",
                        CompanyName = "Tech Solutions Inc.",
                        StartDate = new DateTime(2021, 1, 1),
                        IsCurrentJob = true,
                        Description = "Leading a team of developers in building enterprise web applications using .NET Core and React."
                    },
                    new WorkExperience
                    {
                        Id = Guid.NewGuid(),
                        JobTitle = "Software Developer",
                        CompanyName = "StartUp Hub",
                        StartDate = new DateTime(2018, 6, 1),
                        EndDate = new DateTime(2020, 12, 31),
                        IsCurrentJob = false,
                        Description = "Developed and maintained multiple client projects using C#, ASP.NET MVC, and SQL Server."
                    }
                },
                Educations = new List<Education>
                {
                    new Education
                    {
                        Id = Guid.NewGuid(),
                        Degree = "Master of Science",
                        FieldOfStudy = "Computer Science",
                        InstitutionName = "Tech University",
                        StartDate = new DateTime(2016, 9, 1),
                        EndDate = new DateTime(2018, 5, 30),
                        Grade = "3.8 GPA",
                        IsCurrentlyStudying = false
                    },
                    new Education
                    {
                        Id = Guid.NewGuid(),
                        Degree = "Bachelor of Science",
                        FieldOfStudy = "Software Engineering",
                        InstitutionName = "State College",
                        StartDate = new DateTime(2012, 9, 1),
                        EndDate = new DateTime(2016, 5, 30),
                        Grade = "3.6 GPA",
                        IsCurrentlyStudying = false
                    }
                }
            };
            context.Candidates.Add(janeCandidate);
        }

        if (!await context.Users.AnyAsync(u => u.Email == "john.smith@example.com"))
        {
            var userId = Guid.NewGuid();
            var user = new User { Id = userId, Email = "john.smith@example.com", PasswordHash = passwordHash, Role = "Candidate", IsActive = true, CreatedAt = DateTime.UtcNow };
            context.Users.Add(user);
            context.Candidates.Add(new Candidate
            {
                Id = Guid.NewGuid(), UserId = userId, FirstName = "John", LastName = "Smith", PhoneNumber = "555-0202",
                DateOfBirth = new DateTime(1998, 7, 12), Gender = "Male", CurrentLocation = "Austin, TX",
                CurrentJobTitle = "Frontend Developer", Education = "BS in Software Engineering", ExperienceYears = 3,
                Skills = new[] { "React", "TypeScript", "Tailwind CSS", "Node.js" }, PreferredJobTypes = new[] { "Full-time" },
                ExpectedSalary = 95000, PreferredLocations = new[] { "Austin", "Remote" }, CreatedAt = DateTime.UtcNow
            });
        }
    }
}
