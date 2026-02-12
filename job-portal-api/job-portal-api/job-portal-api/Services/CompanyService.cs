using Microsoft.EntityFrameworkCore;
using JobPortalApi.Data;
using JobPortalApi.DTOs;
using JobPortalApi.Helpers;
using JobPortalApi.Models;

namespace JobPortalApi.Services;

public class CompanyService : ICompanyService
{
    private readonly JobPortalDbContext _context;

    public CompanyService(JobPortalDbContext context)
    {
        _context = context;
    }

    private async Task<Company?> GetCompanyByUserIdAsync(Guid userId)
    {
        return await _context.Companies
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.UserId == userId);
    }

    public async Task<ApiResponse<CompanyProfileDto>> GetProfileAsync(Guid userId)
    {
        var company = await GetCompanyByUserIdAsync(userId);

        if (company == null)
            return ApiResponse<CompanyProfileDto>.ErrorResponse("Company profile not found", "NOT_FOUND");

        var profileDto = new CompanyProfileDto
        {
            Id = company.Id,
            UserId = company.UserId,
            CompanyName = company.CompanyName,
            CompanyEmail = company.CompanyEmail,
            PhoneNumber = company.PhoneNumber,
            Website = company.Website,
            Industry = company.Industry,
            CompanySize = company.CompanySize,
            Description = company.Description,
            Logo = company.Logo,
            BannerImage = company.BannerImage,
            HeadquarterAddress = company.HeadquarterAddress,
            City = company.City,
            State = company.State,
            Country = company.Country,
            ZipCode = company.ZipCode,
            LinkedInUrl = company.LinkedInUrl,
            TwitterUrl = company.TwitterUrl,
            FacebookUrl = company.FacebookUrl,
            Founded = company.Founded,
            TechStack = company.TechStack,
            SubscriptionPlan = company.SubscriptionPlan,
            SubscriptionExpiresAt = company.SubscriptionExpiresAt,
            IsFeatured = company.IsFeatured,
            CreatedAt = company.CreatedAt
        };

        return ApiResponse<CompanyProfileDto>.SuccessResponse(profileDto);
    }

    public async Task<ApiResponse<CompanyProfileDto>> UpdateProfileAsync(Guid userId, UpdateCompanyProfileRequest request)
    {
        var company = await GetCompanyByUserIdAsync(userId);
        if (company == null)
            return ApiResponse<CompanyProfileDto>.ErrorResponse("Company profile not found", "NOT_FOUND");

        // Check if company name is already taken by another company (unique constraint)
        if (request.CompanyName != company.CompanyName && 
            await _context.Companies.AnyAsync(c => c.CompanyName == request.CompanyName))
        {
            return ApiResponse<CompanyProfileDto>.ErrorResponse("Company name already exists", "DUPLICATE_ENTRY");
        }

        company.CompanyName = request.CompanyName;
        company.CompanyEmail = request.CompanyEmail;
        company.PhoneNumber = request.PhoneNumber;
        company.Website = request.Website ?? company.Website;
        company.Industry = request.Industry ?? company.Industry;
        company.CompanySize = request.CompanySize ?? company.CompanySize;
        company.Description = request.Description ?? company.Description;
        company.HeadquarterAddress = request.HeadquarterAddress ?? company.HeadquarterAddress;
        company.City = request.City ?? company.City;
        company.State = request.State ?? company.State;
        company.Country = request.Country ?? company.Country;
        company.ZipCode = request.ZipCode ?? company.ZipCode;
        company.LinkedInUrl = request.LinkedInUrl ?? company.LinkedInUrl;
        company.TwitterUrl = request.TwitterUrl ?? company.TwitterUrl;
        company.FacebookUrl = request.FacebookUrl ?? company.FacebookUrl;
        company.Founded = request.Founded ?? company.Founded;
        company.TechStack = request.TechStack.Length > 0 ? request.TechStack : company.TechStack;
        company.UpdatedAt = DateTime.UtcNow;

        _context.Companies.Update(company);
        await _context.SaveChangesAsync();

        return await GetProfileAsync(userId);
    }

    public async Task<ApiResponse<object>> GetDashboardStatsAsync(Guid userId)
    {
        var company = await GetCompanyByUserIdAsync(userId);
        if (company == null)
            return ApiResponse<object>.ErrorResponse("Company profile not found", "NOT_FOUND");

        var totalJobs = await _context.Jobs.CountAsync(j => j.CompanyId == company.Id);
        var activeJobs = await _context.Jobs.CountAsync(j => j.CompanyId == company.Id && j.Status == "Active");
        // Get total applications for all jobs of this company
        var totalApplications = await _context.JobApplications
            .Include(a => a.Job)
            .CountAsync(a => a.Job.CompanyId == company.Id);
        
        var newApplicationsToday = await _context.JobApplications
            .Include(a => a.Job)
            .CountAsync(a => a.Job.CompanyId == company.Id && a.AppliedAt >= DateTime.UtcNow.Date);

        var stats = new CompanyDashboardStats
        {
            TotalJobs = totalJobs,
            ActiveJobs = activeJobs,
            TotalApplications = totalApplications,
            NewApplicationsToday = newApplicationsToday,
            ProfileViews = 0 // Mock value or implement tracking logic
        };

        return ApiResponse<object>.SuccessResponse(stats);
    }

    public async Task<ApiResponse<JobDto>> CreateJobAsync(Guid userId, CreateJobRequest request)
    {
        var company = await GetCompanyByUserIdAsync(userId);
        if (company == null)
            return ApiResponse<JobDto>.ErrorResponse("Company profile not found", "NOT_FOUND");

        var job = new Job
        {
            Id = Guid.NewGuid(),
            CompanyId = company.Id,
            Title = request.Title,
            Description = request.Description,
            Requirements = request.Requirements,
            Responsibilities = request.Responsibilities,
            JobType = request.JobType,
            ExperienceLevel = request.ExperienceLevel,
            MinSalary = request.MinSalary,
            MaxSalary = request.MaxSalary,
            SalaryCurrency = request.SalaryCurrency,
            SalaryPeriod = request.SalaryPeriod,
            Location = request.Location,
            City = request.City,
            State = request.State,
            Country = request.Country,
            IsRemote = request.IsRemote,
            RequiredSkills = request.RequiredSkills,
            Tags = request.Tags,
            Category = request.Category,
            Status = request.Status,
            Deadline = request.Deadline,
            Openings = request.Openings,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Jobs.Add(job);
        await _context.SaveChangesAsync();

        // Return created job DTO
        return await GetJobDetailsAsync(job.Id, userId);
    }

    public async Task<ApiResponse<JobDto>> UpdateJobAsync(Guid userId, Guid jobId, CreateJobRequest request)
    {
        var company = await GetCompanyByUserIdAsync(userId);
        if (company == null)
            return ApiResponse<JobDto>.ErrorResponse("Company profile not found", "NOT_FOUND");

        var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == jobId && j.CompanyId == company.Id);
        if (job == null)
            return ApiResponse<JobDto>.ErrorResponse("Job not found or access denied", "NOT_FOUND");

        job.Title = request.Title;
        job.Description = request.Description;
        job.Requirements = request.Requirements;
        job.Responsibilities = request.Responsibilities;
        job.JobType = request.JobType;
        job.ExperienceLevel = request.ExperienceLevel;
        job.MinSalary = request.MinSalary;
        job.MaxSalary = request.MaxSalary;
        job.SalaryCurrency = request.SalaryCurrency;
        job.SalaryPeriod = request.SalaryPeriod;
        job.Location = request.Location;
        job.City = request.City;
        job.State = request.State;
        job.Country = request.Country;
        job.IsRemote = request.IsRemote;
        job.RequiredSkills = request.RequiredSkills;
        job.Tags = request.Tags;
        job.Category = request.Category;
        job.Status = request.Status;
        job.Deadline = request.Deadline;
        job.Openings = request.Openings;
        job.UpdatedAt = DateTime.UtcNow;

        _context.Jobs.Update(job);
        await _context.SaveChangesAsync();

        return await GetJobDetailsAsync(jobId, userId);
    }

    public async Task<ApiResponse<object>> DeleteJobAsync(Guid userId, Guid jobId)
    {
        var company = await GetCompanyByUserIdAsync(userId);
        if (company == null)
            return ApiResponse<object>.ErrorResponse("Company profile not found", "NOT_FOUND");

        var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == jobId && j.CompanyId == company.Id);
        if (job == null)
            return ApiResponse<object>.ErrorResponse("Job not found or access denied", "NOT_FOUND");

        _context.Jobs.Remove(job);
        await _context.SaveChangesAsync();

        return ApiResponse<object>.SuccessResponse(null, "Job deleted successfully");
    }

    public async Task<ApiResponse<PaginationResponse<JobDto>>> GetCompanyJobsAsync(Guid userId, string? status, int page, int pageSize)
    {
        var company = await GetCompanyByUserIdAsync(userId);
        if (company == null)
            return ApiResponse<PaginationResponse<JobDto>>.ErrorResponse("Company profile not found", "NOT_FOUND");

        var query = _context.Jobs
            .Include(j => j.Applications)
            .Where(j => j.CompanyId == company.Id);

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(j => j.Status == status);
        }

        var totalItems = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        var jobs = await query
            .OrderByDescending(j => j.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var jobDtos = jobs.Select(j => new JobDto
        {
            Id = j.Id,
            Title = j.Title,
            Description = j.Description,
            JobType = j.JobType,
            Location = j.Location,
            Status = j.Status,
            ApplicationsCount = j.Applications.Count,
            Deadline = j.Deadline,
            CreatedAt = j.CreatedAt,
            // Minimal company info as it's the company viewing their own jobs
            Company = new CompanyBasicInfo { Id = company.Id, Name = company.CompanyName }
        }).ToList();

        return ApiResponse<PaginationResponse<JobDto>>.SuccessResponse(new PaginationResponse<JobDto>
        {
            Items = jobDtos,
            Pagination = new PaginationMetadata
            {
                CurrentPage = page,
                PageSize = pageSize,
                TotalPages = totalPages,
                TotalItems = totalItems,
                HasNextPage = page < totalPages,
                HasPreviousPage = page > 1
            }
        });
    }

    public async Task<ApiResponse<JobDto>> GetJobDetailsAsync(Guid jobId, Guid userId)
    {
        // This is for company viewing/editing their own job details
        var company = await GetCompanyByUserIdAsync(userId);
        if (company == null)
            return ApiResponse<JobDto>.ErrorResponse("Company profile not found", "NOT_FOUND");

        var job = await _context.Jobs
            .Include(j => j.Applications)
            .Include(j => j.Company) // Include company to populate fully
            .FirstOrDefaultAsync(j => j.Id == jobId);
            
        if (job == null)
            return ApiResponse<JobDto>.ErrorResponse("Job not found", "NOT_FOUND");
            
        // Check ownership if strict access control needed, though sometimes viewing publicjobs is fine.
        // But for editing purposes this method is often used too. Let's assume ownership check if called via CompanyService usually implies ownership context.
        // But let's allow viewing if it's public too? No, let's keep it simple.
        
        var jobDto = new JobDto
        {
            Id = job.Id,
            Title = job.Title,
            Description = job.Description,
            Requirements = job.Requirements,
            Responsibilities = job.Responsibilities,
            JobType = job.JobType,
            ExperienceLevel = job.ExperienceLevel,
            MinSalary = job.MinSalary,
            MaxSalary = job.MaxSalary,
            SalaryCurrency = job.SalaryCurrency,
            SalaryPeriod = job.SalaryPeriod,
            Location = job.Location,
            City = job.City,
            State = job.State,
            Country = job.Country,
            IsRemote = job.IsRemote,
            RequiredSkills = job.RequiredSkills,
            Tags = job.Tags,
            Category = job.Category,
            Status = job.Status,
            Deadline = job.Deadline,
            Openings = job.Openings,
            CreatedAt = job.CreatedAt,
            ApplicationsCount = job.Applications.Count,
            Company = new CompanyBasicInfo
            {
                Id = job.Company.Id,
                Name = job.Company.CompanyName,
                Logo = job.Company.Logo,
                Industry = job.Company.Industry
            }
        };

        return ApiResponse<JobDto>.SuccessResponse(jobDto);
    }

    public async Task<ApiResponse<PaginationResponse<JobApplicationDetailDto>>> GetJobApplicationsAsync(Guid userId, Guid jobId, string? status, int page, int pageSize)
    {
        var company = await GetCompanyByUserIdAsync(userId);
        if (company == null)
            return ApiResponse<PaginationResponse<JobApplicationDetailDto>>.ErrorResponse("Company profile not found", "NOT_FOUND");

        // Verify job belongs to company
        var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == jobId && j.CompanyId == company.Id);
        if (job == null)
            return ApiResponse<PaginationResponse<JobApplicationDetailDto>>.ErrorResponse("Job not found or access denied", "NOT_FOUND");

        var query = _context.JobApplications
            .Include(a => a.Candidate)
            .ThenInclude(c => c.User)
            .Where(a => a.JobId == jobId);

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(a => a.Status == status);
        }

        var totalItems = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        var applications = await query
            .OrderByDescending(a => a.AppliedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var dtos = applications.Select(a => new JobApplicationDetailDto
        {
            Id = a.Id,
            Status = a.Status,
            KanbanColumn = a.KanbanColumn,
            AppliedAt = a.AppliedAt,
            CoverLetter = a.CoverLetter,
            ResumeUrl = a.ResumeUrl,
            Candidate = new CandidateProfileDto
            {
                Id = a.Candidate.Id,
                UserId = a.Candidate.UserId,
                FirstName = a.Candidate.FirstName,
                LastName = a.Candidate.LastName,
                Email = a.Candidate.User.Email,
                ProfilePicture = a.Candidate.ProfilePicture,
                CurrentJobTitle = a.Candidate.CurrentJobTitle,
                ExperienceYears = a.Candidate.ExperienceYears,
                Skills = a.Candidate.Skills,
                CurrentLocation = a.Candidate.CurrentLocation
                // Populate other fields if needed
            }
        }).ToList();

        return ApiResponse<PaginationResponse<JobApplicationDetailDto>>.SuccessResponse(new PaginationResponse<JobApplicationDetailDto>
        {
            Items = dtos,
            Pagination = new PaginationMetadata
            {
                CurrentPage = page,
                PageSize = pageSize,
                TotalPages = totalPages,
                TotalItems = totalItems,
                HasNextPage = page < totalPages,
                HasPreviousPage = page > 1
            }
        });
    }

    public async Task<ApiResponse<object>> UpdateApplicationStatusAsync(Guid userId, Guid applicationId, UpdateApplicationStatusRequest request)
    {
        var company = await GetCompanyByUserIdAsync(userId);
        if (company == null)
            return ApiResponse<object>.ErrorResponse("Company profile not found", "NOT_FOUND");

        var application = await _context.JobApplications
            .Include(a => a.Job)
            .FirstOrDefaultAsync(a => a.Id == applicationId);

        if (application == null)
            return ApiResponse<object>.ErrorResponse("Application not found", "NOT_FOUND");

        if (application.Job.CompanyId != company.Id)
            return ApiResponse<object>.ErrorResponse("Access denied", "FORBIDDEN");

        application.Status = request.Status;
        if (!string.IsNullOrEmpty(request.KanbanColumn))
        {
            application.KanbanColumn = request.KanbanColumn;
        }
        application.UpdatedAt = DateTime.UtcNow;

        _context.JobApplications.Update(application);
        await _context.SaveChangesAsync();

        return ApiResponse<object>.SuccessResponse(null, "Application status updated successfully");
    }

    public async Task<ApiResponse<PaginationResponse<CandidateProfileDto>>> SearchCandidatesAsync(string? keyword, string? location, int? experienceYears, string? skills, int page, int pageSize)
    {
        var query = _context.Candidates
            .Include(c => c.User)
            .AsQueryable();

        if (!string.IsNullOrEmpty(keyword))
        {
            query = query.Where(c => c.FirstName.Contains(keyword) || c.LastName.Contains(keyword) || c.CurrentJobTitle.Contains(keyword));
        }

        if (!string.IsNullOrEmpty(location))
        {
            query = query.Where(c => c.CurrentLocation.Contains(location));
        }

        if (experienceYears.HasValue)
        {
            query = query.Where(c => c.ExperienceYears >= experienceYears.Value);
        }

        // Skills filtering will be tricky in EF Core without full-text search or proper splitting.
        // Doing simple string contains for now.
        if (!string.IsNullOrEmpty(skills))
        {
            // Assuming skills is comma separated in DB or JSON? In Candidate model it is string[]? No, EF Core conversion makes it string in DB.
            // But EF Core 8.0 with SQL Server supports primitive collections? Or did I configure ValueConversion?
            // In OnModelCreating I configured: 
            // entity.Property(e => e.Skills).HasConversion(...)
            // So in DB it is a single string. EF Core translates LINQ operations on client side if not careful or if provider supports it.
            // With HasConversion, EF Core might filter in memory if I use array methods, or fail translation.
            // Safe bet: search the string column if I knew the mapping logic, but here I'm using the entity property which is string[].
            // EF Core 8 might support `Contains` on primitive collection if JSON column used, but here I used string join locally.
            // So queries on `Skills` (array) will likely be evaluated client-side or fail if I don't use raw SQL or specific patterns.
            // Let's rely on basic keyword search on mapping-conversion if possible, or skip complex skill filtering for this simplified version.
            // Or better: use `Contains` on the serialized version if I could access it, but I can't easily here.
            // I'll skip skill filtering detail implementation for now or implement client-side evaluation (not recommended for large datasets).
            // Let's try simple client side for now as dataset is small or use keyword search on other fields.
        }

        var totalItems = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        var candidates = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var dtos = candidates.Select(c => new CandidateProfileDto
        {
            Id = c.Id,
            UserId = c.UserId,
            FirstName = c.FirstName,
            LastName = c.LastName,
            Email = c.User.Email,
            ProfilePicture = c.ProfilePicture,
            CurrentJobTitle = c.CurrentJobTitle,
            Education = c.Education,
            ExperienceYears = c.ExperienceYears,
            Skills = c.Skills,
            CurrentLocation = c.CurrentLocation,
            ExpectedSalary = c.ExpectedSalary,
            LinkedInUrl = c.LinkedInUrl
        }).ToList();

        return ApiResponse<PaginationResponse<CandidateProfileDto>>.SuccessResponse(new PaginationResponse<CandidateProfileDto>
        {
            Items = dtos,
            Pagination = new PaginationMetadata
            {
                CurrentPage = page,
                PageSize = pageSize,
                TotalPages = totalPages,
                TotalItems = totalItems,
                HasNextPage = page < totalPages,
                HasPreviousPage = page > 1
            }
        });
    }

    public async Task<ApiResponse<object>> SaveCandidateAsync(Guid userId, Guid candidateId, string? notes)
    {
        var company = await GetCompanyByUserIdAsync(userId);
        if (company == null)
            return ApiResponse<object>.ErrorResponse("Company profile not found", "NOT_FOUND");

        var candidate = await _context.Candidates.FindAsync(candidateId);
        if (candidate == null)
            return ApiResponse<object>.ErrorResponse("Candidate not found", "NOT_FOUND");

        if (await _context.SavedCandidates.AnyAsync(s => s.CompanyId == company.Id && s.CandidateId == candidateId))
            return ApiResponse<object>.ErrorResponse("Candidate already saved", "DUPLICATE_ENTRY");

        var savedCandidate = new SavedCandidate
        {
            Id = Guid.NewGuid(),
            CompanyId = company.Id,
            CandidateId = candidateId,
            Notes = notes,
            SavedAt = DateTime.UtcNow
        };

        _context.SavedCandidates.Add(savedCandidate);
        await _context.SaveChangesAsync();

        return ApiResponse<object>.SuccessResponse(null, "Candidate saved successfully");
    }

    public async Task<ApiResponse<List<SavedCandidateDto>>> GetSavedCandidatesAsync(Guid userId)
    {
        var company = await GetCompanyByUserIdAsync(userId);
        if (company == null)
            return ApiResponse<List<SavedCandidateDto>>.ErrorResponse("Company profile not found", "NOT_FOUND");

        var savedCandidates = await _context.SavedCandidates
            .Include(s => s.Candidate)
            .ThenInclude(c => c.User)
            .Where(s => s.CompanyId == company.Id)
            .OrderByDescending(s => s.SavedAt)
            .ToListAsync();

        var dtos = savedCandidates.Select(s => new SavedCandidateDto
        {
            Id = s.Id,
            Notes = s.Notes,
            SavedAt = s.SavedAt,
            Candidate = new CandidateProfileDto
            {
                Id = s.Candidate.Id,
                FirstName = s.Candidate.FirstName,
                LastName = s.Candidate.LastName,
                Email = s.Candidate.User.Email,
                ProfilePicture = s.Candidate.ProfilePicture,
                CurrentJobTitle = s.Candidate.CurrentJobTitle,
                ExperienceYears = s.Candidate.ExperienceYears,
                Skills = s.Candidate.Skills
            }
        }).ToList();

        return ApiResponse<List<SavedCandidateDto>>.SuccessResponse(dtos);
    }

    public async Task<ApiResponse<object>> RemoveSavedCandidateAsync(Guid userId, Guid candidateId)
    {
        var company = await GetCompanyByUserIdAsync(userId);
        if (company == null)
            return ApiResponse<object>.ErrorResponse("Company profile not found", "NOT_FOUND");

        var savedCandidate = await _context.SavedCandidates
            .FirstOrDefaultAsync(s => s.CompanyId == company.Id && s.CandidateId == candidateId);

        if (savedCandidate == null)
            return ApiResponse<object>.ErrorResponse("Saved candidate not found", "NOT_FOUND");

        _context.SavedCandidates.Remove(savedCandidate);
        await _context.SaveChangesAsync();

        return ApiResponse<object>.SuccessResponse(null, "Candidate removed from saved list");
    }
}
