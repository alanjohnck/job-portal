using Microsoft.EntityFrameworkCore;
using JobPortalApi.Data;
using JobPortalApi.Models;
using JobPortalApi.DTOs;
using JobPortalApi.Helpers;

namespace JobPortalApi.Services;

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

public class CandidateProfileService : ICandidateProfileService
{
    private readonly JobPortalDbContext _context;

    public CandidateProfileService(JobPortalDbContext context)
    {
        _context = context;
    }

    private async Task<Candidate?> GetCandidateByUserIdAsync(Guid userId)
    {
        return await _context.Candidates
            .Include(c => c.User)
            .Include(c => c.WorkExperiences)
            .Include(c => c.Educations)
            .Include(c => c.Certifications)
            .FirstOrDefaultAsync(c => c.UserId == userId);
    }

    private CandidateProfileDto MapToProfileDto(Candidate candidate)
    {
        return new CandidateProfileDto
        {
            Id = candidate.Id,
            UserId = candidate.UserId,
            FirstName = candidate.FirstName,
            LastName = candidate.LastName,
            Email = candidate.User.Email,
            PhoneNumber = candidate.PhoneNumber,
            DateOfBirth = candidate.DateOfBirth,
            Gender = candidate.Gender,
            CurrentLocation = candidate.CurrentLocation,
            ProfilePicture = candidate.ProfilePicture,
            CurrentJobTitle = candidate.CurrentJobTitle,
            Education = candidate.Education,
            ExperienceYears = candidate.ExperienceYears,
            Skills = candidate.Skills,
            ResumeUrl = candidate.ResumeUrl,
            Bio = candidate.Bio,
            LinkedInUrl = candidate.LinkedInUrl,
            GithubUrl = candidate.GithubUrl,
            PortfolioUrl = candidate.PortfolioUrl,
            TwitterUrl = candidate.TwitterUrl,
            PreferredJobTypes = candidate.PreferredJobTypes,
            ExpectedSalary = candidate.ExpectedSalary,
            PreferredLocations = candidate.PreferredLocations,
            CreatedAt = candidate.CreatedAt,
            UpdatedAt = candidate.UpdatedAt,
            WorkExperiences = candidate.WorkExperiences.Select(MapToWorkExperienceDto).OrderByDescending(we => we.StartDate).ToList(),
            Educations = candidate.Educations.Select(MapToEducationDto).OrderByDescending(e => e.StartDate).ToList(),
            Certifications = candidate.Certifications.Select(MapToCertificationDto).OrderByDescending(c => c.IssueDate).ToList()
        };
    }

    private WorkExperienceDto MapToWorkExperienceDto(WorkExperience experience)
    {
        return new WorkExperienceDto
        {
            Id = experience.Id,
            JobTitle = experience.JobTitle,
            CompanyName = experience.CompanyName,
            Location = experience.Location,
            EmploymentType = experience.EmploymentType,
            StartDate = experience.StartDate,
            EndDate = experience.EndDate,
            IsCurrentJob = experience.IsCurrentJob,
            Description = experience.Description,
            Achievements = experience.Achievements,
            TechnologiesUsed = experience.TechnologiesUsed
        };
    }

    private EducationDto MapToEducationDto(Education education)
    {
        return new EducationDto
        {
            Id = education.Id,
            InstitutionName = education.InstitutionName,
            Degree = education.Degree,
            FieldOfStudy = education.FieldOfStudy,
            StartDate = education.StartDate,
            EndDate = education.EndDate,
            IsCurrentlyStudying = education.IsCurrentlyStudying,
            Grade = education.Grade,
            Description = education.Description
        };
    }

    private CertificationDto MapToCertificationDto(Certification certification)
    {
        return new CertificationDto
        {
            Id = certification.Id,
            Name = certification.Name,
            IssuingOrganization = certification.IssuingOrganization,
            IssueDate = certification.IssueDate,
            ExpiryDate = certification.ExpiryDate,
            CredentialId = certification.CredentialId,
            CredentialUrl = certification.CredentialUrl
        };
    }

    // Profile Methods
    public async Task<ApiResponse<CandidateProfileDto>> GetProfileAsync(Guid userId)
    {
        var candidate = await GetCandidateByUserIdAsync(userId);
        
        // Auto-create candidate profile if it doesn't exist
        if (candidate == null)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return ApiResponse<CandidateProfileDto>.ErrorResponse("User not found", "USER_NOT_FOUND");

            candidate = new Candidate
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                FirstName = user.Email.Split('@').FirstOrDefault() ?? "User",
                LastName = "",
                PhoneNumber = "",
                CurrentLocation = "",
                Skills = Array.Empty<string>(),
                PreferredJobTypes = Array.Empty<string>(),
                PreferredLocations = Array.Empty<string>(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Candidates.Add(candidate);
            await _context.SaveChangesAsync();
            
            // Reload with includes
            candidate = await GetCandidateByUserIdAsync(userId);
        }

        var profileDto = MapToProfileDto(candidate!);
        return ApiResponse<CandidateProfileDto>.SuccessResponse(profileDto);
    }

    public async Task<ApiResponse<CandidateProfileDto>> GetPublicProfileAsync(Guid candidateId)
    {
        var candidate = await _context.Candidates
            .Include(c => c.User)
            .Include(c => c.WorkExperiences)
            .Include(c => c.Educations)
            .Include(c => c.Certifications)
            .FirstOrDefaultAsync(c => c.Id == candidateId);

        if (candidate == null)
            return ApiResponse<CandidateProfileDto>.ErrorResponse("Candidate not found", "NOT_FOUND");

        var profileDto = MapToProfileDto(candidate);
        return ApiResponse<CandidateProfileDto>.SuccessResponse(profileDto);
    }

    public async Task<ApiResponse<CandidateProfileDto>> UpdateProfileAsync(Guid userId, UpdateCandidateProfileRequest request)
    {
        var candidate = await GetCandidateByUserIdAsync(userId);
        if (candidate == null)
            return ApiResponse<CandidateProfileDto>.ErrorResponse("Candidate profile not found", "NOT_FOUND");

        candidate.FirstName = request.FirstName;
        candidate.LastName = request.LastName;
        candidate.PhoneNumber = request.PhoneNumber;
        candidate.DateOfBirth = request.DateOfBirth;
        candidate.Gender = request.Gender;
        candidate.CurrentLocation = request.CurrentLocation;
        candidate.ProfilePicture = request.ProfilePicture ?? candidate.ProfilePicture;
        candidate.CurrentJobTitle = request.CurrentJobTitle;
        candidate.Education = request.Education;
        candidate.ExperienceYears = request.ExperienceYears;
        candidate.Skills = request.Skills;
        candidate.Bio = request.Bio;
        candidate.LinkedInUrl = request.LinkedInUrl;
        candidate.GithubUrl = request.GithubUrl;
        candidate.PortfolioUrl = request.PortfolioUrl;
        candidate.TwitterUrl = request.TwitterUrl;
        candidate.PreferredJobTypes = request.PreferredJobTypes;
        candidate.ExpectedSalary = request.ExpectedSalary;
        candidate.PreferredLocations = request.PreferredLocations;
        candidate.UpdatedAt = DateTime.UtcNow;

        _context.Candidates.Update(candidate);
        await _context.SaveChangesAsync();

        return await GetProfileAsync(userId);
    }

    public async Task<ApiResponse<string>> UpdateProfilePictureAsync(Guid userId, string pictureUrl)
    {
        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.UserId == userId);
        if (candidate == null)
            return ApiResponse<string>.ErrorResponse("Candidate not found", "NOT_FOUND");

        candidate.ProfilePicture = pictureUrl;
        candidate.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return ApiResponse<string>.SuccessResponse(pictureUrl, "Profile picture updated successfully");
    }

    // Resume Methods
    public async Task<ApiResponse<string>> UpdateResumeAsync(Guid userId, string resumeUrl)
    {
        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.UserId == userId);
        if (candidate == null)
            return ApiResponse<string>.ErrorResponse("Candidate not found", "NOT_FOUND");

        candidate.ResumeUrl = resumeUrl;
        candidate.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return ApiResponse<string>.SuccessResponse(resumeUrl, "Resume updated successfully");
    }

    public async Task<ApiResponse<object>> DeleteResumeAsync(Guid userId)
    {
        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.UserId == userId);
        if (candidate == null)
            return ApiResponse<object>.ErrorResponse("Candidate not found", "NOT_FOUND");

        candidate.ResumeUrl = null;
        candidate.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return ApiResponse<object>.SuccessResponse(null, "Resume deleted successfully");
    }

    // Work Experience Methods
    public async Task<ApiResponse<List<WorkExperienceDto>>> GetWorkExperiencesAsync(Guid userId)
    {
        var candidate = await _context.Candidates
            .Include(c => c.WorkExperiences)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (candidate == null)
            return ApiResponse<List<WorkExperienceDto>>.ErrorResponse("Candidate not found", "NOT_FOUND");

        var experiences = candidate.WorkExperiences
            .Select(MapToWorkExperienceDto)
            .OrderByDescending(we => we.StartDate)
            .ToList();

        return ApiResponse<List<WorkExperienceDto>>.SuccessResponse(experiences);
    }

    public async Task<ApiResponse<WorkExperienceDto>> CreateWorkExperienceAsync(Guid userId, CreateWorkExperienceRequest request)
    {
        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.UserId == userId);
        if (candidate == null)
            return ApiResponse<WorkExperienceDto>.ErrorResponse("Candidate not found", "NOT_FOUND");

        var experience = new WorkExperience
        {
            Id = Guid.NewGuid(),
            CandidateId = candidate.Id,
            JobTitle = request.JobTitle,
            CompanyName = request.CompanyName,
            Location = request.Location,
            EmploymentType = request.EmploymentType,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            IsCurrentJob = request.IsCurrentJob,
            Description = request.Description,
            Achievements = request.Achievements,
            TechnologiesUsed = request.TechnologiesUsed,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.WorkExperiences.Add(experience);
        await _context.SaveChangesAsync();

        return ApiResponse<WorkExperienceDto>.SuccessResponse(MapToWorkExperienceDto(experience), "Work experience added successfully");
    }

    public async Task<ApiResponse<WorkExperienceDto>> UpdateWorkExperienceAsync(Guid userId, Guid experienceId, UpdateWorkExperienceRequest request)
    {
        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.UserId == userId);
        if (candidate == null)
            return ApiResponse<WorkExperienceDto>.ErrorResponse("Candidate not found", "NOT_FOUND");

        var experience = await _context.WorkExperiences
            .FirstOrDefaultAsync(we => we.Id == experienceId && we.CandidateId == candidate.Id);

        if (experience == null)
            return ApiResponse<WorkExperienceDto>.ErrorResponse("Work experience not found", "NOT_FOUND");

        experience.JobTitle = request.JobTitle;
        experience.CompanyName = request.CompanyName;
        experience.Location = request.Location;
        experience.EmploymentType = request.EmploymentType;
        experience.StartDate = request.StartDate;
        experience.EndDate = request.EndDate;
        experience.IsCurrentJob = request.IsCurrentJob;
        experience.Description = request.Description;
        experience.Achievements = request.Achievements;
        experience.TechnologiesUsed = request.TechnologiesUsed;
        experience.UpdatedAt = DateTime.UtcNow;

        _context.WorkExperiences.Update(experience);
        await _context.SaveChangesAsync();

        return ApiResponse<WorkExperienceDto>.SuccessResponse(MapToWorkExperienceDto(experience), "Work experience updated successfully");
    }

    public async Task<ApiResponse<object>> DeleteWorkExperienceAsync(Guid userId, Guid experienceId)
    {
        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.UserId == userId);
        if (candidate == null)
            return ApiResponse<object>.ErrorResponse("Candidate not found", "NOT_FOUND");

        var experience = await _context.WorkExperiences
            .FirstOrDefaultAsync(we => we.Id == experienceId && we.CandidateId == candidate.Id);

        if (experience == null)
            return ApiResponse<object>.ErrorResponse("Work experience not found", "NOT_FOUND");

        _context.WorkExperiences.Remove(experience);
        await _context.SaveChangesAsync();

        return ApiResponse<object>.SuccessResponse(null, "Work experience deleted successfully");
    }

    // Education Methods
    public async Task<ApiResponse<List<EducationDto>>> GetEducationsAsync(Guid userId)
    {
        var candidate = await _context.Candidates
            .Include(c => c.Educations)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (candidate == null)
            return ApiResponse<List<EducationDto>>.ErrorResponse("Candidate not found", "NOT_FOUND");

        var educations = candidate.Educations
            .Select(MapToEducationDto)
            .OrderByDescending(e => e.StartDate)
            .ToList();

        return ApiResponse<List<EducationDto>>.SuccessResponse(educations);
    }

    public async Task<ApiResponse<EducationDto>> CreateEducationAsync(Guid userId, CreateEducationRequest request)
    {
        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.UserId == userId);
        if (candidate == null)
            return ApiResponse<EducationDto>.ErrorResponse("Candidate not found", "NOT_FOUND");

        var education = new Education
        {
            Id = Guid.NewGuid(),
            CandidateId = candidate.Id,
            InstitutionName = request.InstitutionName,
            Degree = request.Degree,
            FieldOfStudy = request.FieldOfStudy,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            IsCurrentlyStudying = request.IsCurrentlyStudying,
            Grade = request.Grade,
            Description = request.Description,
            CreatedAt = DateTime.UtcNow
        };

        _context.Educations.Add(education);
        await _context.SaveChangesAsync();

        return ApiResponse<EducationDto>.SuccessResponse(MapToEducationDto(education), "Education added successfully");
    }

    public async Task<ApiResponse<EducationDto>> UpdateEducationAsync(Guid userId, Guid educationId, UpdateEducationRequest request)
    {
        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.UserId == userId);
        if (candidate == null)
            return ApiResponse<EducationDto>.ErrorResponse("Candidate not found", "NOT_FOUND");

        var education = await _context.Educations
            .FirstOrDefaultAsync(e => e.Id == educationId && e.CandidateId == candidate.Id);

        if (education == null)
            return ApiResponse<EducationDto>.ErrorResponse("Education not found", "NOT_FOUND");

        education.InstitutionName = request.InstitutionName;
        education.Degree = request.Degree;
        education.FieldOfStudy = request.FieldOfStudy;
        education.StartDate = request.StartDate;
        education.EndDate = request.EndDate;
        education.IsCurrentlyStudying = request.IsCurrentlyStudying;
        education.Grade = request.Grade;
        education.Description = request.Description;

        _context.Educations.Update(education);
        await _context.SaveChangesAsync();

        return ApiResponse<EducationDto>.SuccessResponse(MapToEducationDto(education), "Education updated successfully");
    }

    public async Task<ApiResponse<object>> DeleteEducationAsync(Guid userId, Guid educationId)
    {
        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.UserId == userId);
        if (candidate == null)
            return ApiResponse<object>.ErrorResponse("Candidate not found", "NOT_FOUND");

        var education = await _context.Educations
            .FirstOrDefaultAsync(e => e.Id == educationId && e.CandidateId == candidate.Id);

        if (education == null)
            return ApiResponse<object>.ErrorResponse("Education not found", "NOT_FOUND");

        _context.Educations.Remove(education);
        await _context.SaveChangesAsync();

        return ApiResponse<object>.SuccessResponse(null, "Education deleted successfully");
    }

    // Certification Methods
    public async Task<ApiResponse<List<CertificationDto>>> GetCertificationsAsync(Guid userId)
    {
        var candidate = await _context.Candidates
            .Include(c => c.Certifications)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (candidate == null)
            return ApiResponse<List<CertificationDto>>.ErrorResponse("Candidate not found", "NOT_FOUND");

        var certifications = candidate.Certifications
            .Select(MapToCertificationDto)
            .OrderByDescending(c => c.IssueDate)
            .ToList();

        return ApiResponse<List<CertificationDto>>.SuccessResponse(certifications);
    }

    public async Task<ApiResponse<CertificationDto>> CreateCertificationAsync(Guid userId, CreateCertificationRequest request)
    {
        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.UserId == userId);
        if (candidate == null)
            return ApiResponse<CertificationDto>.ErrorResponse("Candidate not found", "NOT_FOUND");

        var certification = new Certification
        {
            Id = Guid.NewGuid(),
            CandidateId = candidate.Id,
            Name = request.Name,
            IssuingOrganization = request.IssuingOrganization,
            IssueDate = request.IssueDate,
            ExpiryDate = request.ExpiryDate,
            CredentialId = request.CredentialId,
            CredentialUrl = request.CredentialUrl,
            CreatedAt = DateTime.UtcNow
        };

        _context.Certifications.Add(certification);
        await _context.SaveChangesAsync();

        return ApiResponse<CertificationDto>.SuccessResponse(MapToCertificationDto(certification), "Certification added successfully");
    }

    public async Task<ApiResponse<CertificationDto>> UpdateCertificationAsync(Guid userId, Guid certificationId, UpdateCertificationRequest request)
    {
        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.UserId == userId);
        if (candidate == null)
            return ApiResponse<CertificationDto>.ErrorResponse("Candidate not found", "NOT_FOUND");

        var certification = await _context.Certifications
            .FirstOrDefaultAsync(c => c.Id == certificationId && c.CandidateId == candidate.Id);

        if (certification == null)
            return ApiResponse<CertificationDto>.ErrorResponse("Certification not found", "NOT_FOUND");

        certification.Name = request.Name;
        certification.IssuingOrganization = request.IssuingOrganization;
        certification.IssueDate = request.IssueDate;
        certification.ExpiryDate = request.ExpiryDate;
        certification.CredentialId = request.CredentialId;
        certification.CredentialUrl = request.CredentialUrl;

        _context.Certifications.Update(certification);
        await _context.SaveChangesAsync();

        return ApiResponse<CertificationDto>.SuccessResponse(MapToCertificationDto(certification), "Certification updated successfully");
    }

    public async Task<ApiResponse<object>> DeleteCertificationAsync(Guid userId, Guid certificationId)
    {
        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.UserId == userId);
        if (candidate == null)
            return ApiResponse<object>.ErrorResponse("Candidate not found", "NOT_FOUND");

        var certification = await _context.Certifications
            .FirstOrDefaultAsync(c => c.Id == certificationId && c.CandidateId == candidate.Id);

        if (certification == null)
            return ApiResponse<object>.ErrorResponse("Certification not found", "NOT_FOUND");

        _context.Certifications.Remove(certification);
        await _context.SaveChangesAsync();

        return ApiResponse<object>.SuccessResponse(null, "Certification deleted successfully");
    }

    // Skills Methods
    public async Task<ApiResponse<string[]>> UpdateSkillsAsync(Guid userId, string[] skills)
    {
        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.UserId == userId);
        if (candidate == null)
            return ApiResponse<string[]>.ErrorResponse("Candidate not found", "NOT_FOUND");

        candidate.Skills = skills;
        candidate.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return ApiResponse<string[]>.SuccessResponse(skills, "Skills updated successfully");
    }
}
