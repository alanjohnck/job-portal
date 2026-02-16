using Microsoft.EntityFrameworkCore;
using JobPortalApi.Models;

namespace JobPortalApi.Data;

public class JobPortalDbContext : DbContext
{
    public JobPortalDbContext(DbContextOptions<JobPortalDbContext> options) : base(options)
    {
    }

    // DbSets
    public DbSet<User> Users { get; set; }
    public DbSet<Candidate> Candidates { get; set; }
    public DbSet<Company> Companies { get; set; }
    public DbSet<Job> Jobs { get; set; }
    public DbSet<JobApplication> JobApplications { get; set; }
    public DbSet<MockTest> MockTests { get; set; }
    public DbSet<TestResult> TestResults { get; set; }
    public DbSet<SavedJob> SavedJobs { get; set; }
    public DbSet<SavedCandidate> SavedCandidates { get; set; }
    public DbSet<SupportTicket> SupportTickets { get; set; }
    public DbSet<AdminLog> AdminLogs { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<WorkExperience> WorkExperiences { get; set; }
    public DbSet<Education> Educations { get; set; }
    public DbSet<Certification> Certifications { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<TestQuestion> TestQuestions { get; set; }
    public DbSet<TestQuestionOption> TestQuestionOptions { get; set; }
    public DbSet<TestAnswer> TestAnswers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User Configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.Role);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.Role).IsRequired().HasMaxLength(50);
        });

        // Candidate Configuration
        modelBuilder.Entity<Candidate>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId).IsUnique();
            entity.HasOne(e => e.User)
                .WithOne(u => u.Candidate)
                .HasForeignKey<Candidate>(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
            entity.Property(e => e.ExpectedSalary).HasColumnType("decimal(18,2)");
            
            // Configure array properties
            entity.Property(e => e.Skills)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries));
            
            entity.Property(e => e.PreferredJobTypes)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries));
            
            entity.Property(e => e.PreferredLocations)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries));
        });

        // WorkExperience Configuration
        modelBuilder.Entity<WorkExperience>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.CandidateId);
            
            entity.HasOne(e => e.Candidate)
                .WithMany(c => c.WorkExperiences)
                .HasForeignKey(e => e.CandidateId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.JobTitle).IsRequired().HasMaxLength(200);
            entity.Property(e => e.CompanyName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Location).HasMaxLength(200);
            entity.Property(e => e.EmploymentType).HasMaxLength(50);
            entity.Property(e => e.Description).HasMaxLength(5000);
            
            entity.Property(e => e.Achievements)
                .HasConversion(
                    v => string.Join("|||", v),
                    v => v.Split("|||", StringSplitOptions.RemoveEmptyEntries));
            
            entity.Property(e => e.TechnologiesUsed)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries));
        });

        // Education Configuration
        modelBuilder.Entity<Education>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.CandidateId);
            
            entity.HasOne(e => e.Candidate)
                .WithMany(c => c.Educations)
                .HasForeignKey(e => e.CandidateId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.InstitutionName).IsRequired().HasMaxLength(300);
            entity.Property(e => e.Degree).IsRequired().HasMaxLength(100);
            entity.Property(e => e.FieldOfStudy).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Grade).HasMaxLength(50);
            entity.Property(e => e.Description).HasMaxLength(2000);
        });

        // Certification Configuration
        modelBuilder.Entity<Certification>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.CandidateId);
            
            entity.HasOne(e => e.Candidate)
                .WithMany(c => c.Certifications)
                .HasForeignKey(e => e.CandidateId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.Name).IsRequired().HasMaxLength(300);
            entity.Property(e => e.IssuingOrganization).IsRequired().HasMaxLength(300);
            entity.Property(e => e.CredentialId).HasMaxLength(200);
            entity.Property(e => e.CredentialUrl).HasMaxLength(500);
        });

        // Project Configuration
        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.CandidateId);
            
            entity.HasOne(e => e.Candidate)
                .WithMany(c => c.Projects)
                .HasForeignKey(e => e.CandidateId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.ProjectUrl).HasMaxLength(500);
            entity.Property(e => e.RepoUrl).HasMaxLength(500);
            entity.Property(e => e.ImageUrl).HasMaxLength(500);

            entity.Property(e => e.Technologies)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries));
        });

        // Company Configuration
        modelBuilder.Entity<Company>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId).IsUnique();
            entity.HasIndex(e => e.CompanyName).IsUnique();
            
            entity.HasOne(e => e.User)
                .WithOne(u => u.Company)
                .HasForeignKey<Company>(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.CompanyName).IsRequired().HasMaxLength(255);
            entity.Property(e => e.CompanyEmail).IsRequired().HasMaxLength(255);
            entity.Property(e => e.AnnualRevenue).HasColumnType("decimal(18,2)");
            
            // Configure array properties
            entity.Property(e => e.TechStack)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries));
        });

        // Job Configuration
        modelBuilder.Entity<Job>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.CompanyId);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.Location);
            entity.HasIndex(e => e.CreatedAt);
            
            entity.HasOne(e => e.Company)
                .WithMany(c => c.Jobs)
                .HasForeignKey(e => e.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.Title).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Description).IsRequired();
            entity.Property(e => e.MinSalary).HasColumnType("decimal(18,2)");
            entity.Property(e => e.MaxSalary).HasColumnType("decimal(18,2)");
            
            // Configure array properties
            entity.Property(e => e.Requirements)
                .HasConversion(
                    v => string.Join("|||", v),
                    v => v.Split("|||", StringSplitOptions.RemoveEmptyEntries));
            
            entity.Property(e => e.Responsibilities)
                .HasConversion(
                    v => string.Join("|||", v),
                    v => v.Split("|||", StringSplitOptions.RemoveEmptyEntries));
            
            entity.Property(e => e.RequiredSkills)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries));
            
            entity.Property(e => e.Tags)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries));
        });

        // JobApplication Configuration
        modelBuilder.Entity<JobApplication>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.JobId);
            entity.HasIndex(e => e.CandidateId);
            entity.HasIndex(e => e.Status);
            
            entity.HasOne(e => e.Job)
                .WithMany(j => j.Applications)
                .HasForeignKey(e => e.JobId)
                .OnDelete(DeleteBehavior.Restrict);
            
            entity.HasOne(e => e.Candidate)
                .WithMany(c => c.Applications)
                .HasForeignKey(e => e.CandidateId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // MockTest Configuration
        modelBuilder.Entity<MockTest>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.JobId);
            entity.HasIndex(e => e.CompanyId);
            
            entity.HasOne(e => e.Job)
                .WithMany(j => j.MockTests)
                .HasForeignKey(e => e.JobId)
                .OnDelete(DeleteBehavior.Restrict);
            
            entity.HasOne(e => e.Company)
                .WithMany(c => c.MockTests)
                .HasForeignKey(e => e.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.Title).IsRequired().HasMaxLength(255);
        });

        // TestResult Configuration
        modelBuilder.Entity<TestResult>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.MockTestId, e.CandidateId }).IsUnique();
            
            entity.HasOne(e => e.MockTest)
                .WithMany(m => m.TestResults)
                .HasForeignKey(e => e.MockTestId)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.Candidate)
                .WithMany(c => c.TestResults)
                .HasForeignKey(e => e.CandidateId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // SavedJob Configuration
        modelBuilder.Entity<SavedJob>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.CandidateId, e.JobId }).IsUnique();
            
            entity.HasOne(e => e.Candidate)
                .WithMany(c => c.SavedJobs)
                .HasForeignKey(e => e.CandidateId)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.Job)
                .WithMany(j => j.SavedJobs)
                .HasForeignKey(e => e.JobId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // SavedCandidate Configuration
        modelBuilder.Entity<SavedCandidate>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.CompanyId, e.CandidateId }).IsUnique();
            
            entity.HasOne(e => e.Company)
                .WithMany(c => c.SavedCandidates)
                .HasForeignKey(e => e.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.Candidate)
                .WithMany()
                .HasForeignKey(e => e.CandidateId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // SupportTicket Configuration
        modelBuilder.Entity<SupportTicket>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.TicketNumber).IsUnique();
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Status);
            
            entity.HasOne(e => e.User)
                .WithMany(u => u.SupportTickets)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.TicketNumber).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Subject).IsRequired().HasMaxLength(500);
        });

        // AdminLog Configuration
        modelBuilder.Entity<AdminLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.AdminUserId);
            entity.HasIndex(e => e.Timestamp);
        });

        // RefreshToken Configuration
        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Token).IsUnique();
            entity.HasIndex(e => e.UserId);
            
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.Token).IsRequired();
        });

        // Notification Configuration
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => e.IsRead);
            
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Message).IsRequired().HasMaxLength(1000);
            entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
        });

        // TestQuestion Configuration
        modelBuilder.Entity<TestQuestion>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.MockTest)
                .WithMany(m => m.Questions)
                .HasForeignKey(e => e.MockTestId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // TestQuestionOption Configuration
        modelBuilder.Entity<TestQuestionOption>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.TestQuestion)
                .WithMany(q => q.Options)
                .HasForeignKey(e => e.TestQuestionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // TestAnswer Configuration
        modelBuilder.Entity<TestAnswer>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.TestResultId);
            entity.HasIndex(e => e.TestQuestionId);

            entity.HasOne(e => e.TestResult)
                .WithMany(tr => tr.Answers)
                .HasForeignKey(e => e.TestResultId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.TestQuestion)
                .WithMany(q => q.Answers) // Updated to reflect model
                .HasForeignKey(e => e.TestQuestionId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.SelectedOption)
                .WithMany()
                .HasForeignKey(e => e.SelectedOptionId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
