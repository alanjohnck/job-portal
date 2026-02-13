const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5113';
const API_URL = `${API_BASE_URL}/api/v1`;

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

export const getJobs = async (params = {}) => {
    // Remove null/undefined/empty params
    const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== '')
    );
    const query = new URLSearchParams(cleanParams).toString();
    const response = await fetch(`${API_URL}/candidates/jobs/search?${query}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch jobs');
    return response.json();
};

export const getJobDetails = async (id) => {
    const response = await fetch(`${API_URL}/candidates/jobs/${id}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch job details');
    return response.json();
};

export const registerCandidate = async (data) => {
    const response = await fetch(`${API_URL}/auth/register/candidate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
};

export const login = async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });
    return response.json();
};

// Company APIs
export const getJobApplications = async (jobId, status, page = 1, pageSize = 20) => {
    const params = new URLSearchParams({ page, pageSize });
    if (status) params.append('status', status);
    
    const response = await fetch(`${API_URL}/companies/jobs/${jobId}/applications?${params}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch job applications');
    return response.json();
};

export const updateApplicationStatus = async (applicationId, status, kanbanColumn) => {
    const response = await fetch(`${API_URL}/companies/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status, kanbanColumn })
    });
    if (!response.ok) throw new Error('Failed to update application status');
    return response.json();
};

export const createJob = async (jobData) => {
    const response = await fetch(`${API_URL}/companies/jobs`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(jobData)
    });
    if (!response.ok) throw new Error('Failed to create job');
    return response.json();
};

export const getCompanyJobs = async (status, page = 1, pageSize = 20) => {
    const params = new URLSearchParams({ page, pageSize });
    if (status) params.append('status', status);
    
    const response = await fetch(`${API_URL}/companies/jobs?${params}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch company jobs');
    return response.json();
};

export const getCompanyDashboard = async () => {
    const response = await fetch(`${API_URL}/companies/dashboard`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
};

export const getCompanyProfile = async () => {
    const response = await fetch(`${API_URL}/companies/profile`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch company profile');
    return response.json();
};

export const searchCandidates = async (keyword, location, experienceYears, skills, page = 1, pageSize = 20) => {
    const params = new URLSearchParams({ page, pageSize });
    if (keyword) params.append('keyword', keyword);
    if (location) params.append('location', location);
    if (experienceYears != null && experienceYears !== '') params.append('experienceYears', experienceYears);
    if (skills) params.append('skills', skills);

    const response = await fetch(`${API_URL}/companies/candidates/search?${params}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to search candidates');
    return response.json();
};

export const saveCandidate = async (candidateId, notes = null) => {
    const response = await fetch(`${API_URL}/companies/candidates/${candidateId}/save`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(notes)
    });
    if (!response.ok) throw new Error('Failed to save candidate');
    return response.json();
};

export const getSavedCandidates = async () => {
    const response = await fetch(`${API_URL}/companies/candidates/saved`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch saved candidates');
    return response.json();
};

export const removeSavedCandidate = async (candidateId) => {
    const response = await fetch(`${API_URL}/companies/candidates/${candidateId}/save`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to remove saved candidate');
    return response.json();
};

export const updateCompanyProfile = async (profileData) => {
    const response = await fetch(`${API_URL}/companies/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(profileData)
    });
    if (!response.ok) throw new Error('Failed to update company profile');
    return response.json();
};

// Candidate APIs
export const applyForJob = async (jobId, coverLetter, resumeUrl) => {
    const response = await fetch(`${API_URL}/candidates/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ coverLetter, resumeUrl })
    });
    if (!response.ok) throw new Error('Failed to apply for job');
    return response.json();
};

export const saveJob = async (jobId) => {
    const response = await fetch(`${API_URL}/candidates/jobs/${jobId}/save`, {
        method: 'POST',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to save job');
    return response.json();
};

export const unsaveJob = async (jobId) => {
    const response = await fetch(`${API_URL}/candidates/jobs/${jobId}/save`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to unsave job');
    return response.json();
};

export const getCompanies = async (keyword, industry, page = 1, pageSize = 20) => {
    const params = new URLSearchParams({ page, pageSize });
    if (keyword) params.append('keyword', keyword);
    if (industry) params.append('industry', industry);
    
    const response = await fetch(`${API_URL}/candidates/companies/search?${params}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch companies');
    return response.json();
};

export const getMyApplications = async (status, page = 1, pageSize = 20) => {
    const params = new URLSearchParams({ page, pageSize });
    if (status) params.append('status', status);

    const response = await fetch(`${API_URL}/candidates/applications?${params}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch applications');
    return response.json();
};

export const getSavedJobs = async () => {
    const response = await fetch(`${API_URL}/candidates/jobs/saved`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch saved jobs');
    return response.json();
};

// Notifications APIs
export const getNotifications = async (unreadOnly = false) => {
    const params = new URLSearchParams();
    if (unreadOnly) params.append('unreadOnly', 'true');
    const query = params.toString();
    const response = await fetch(`${API_URL}/notifications${query ? `?${query}` : ''}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
};

export const markNotificationRead = async (notificationId) => {
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to mark notification as read');
    return response.json();
};

export const markAllNotificationsRead = async () => {
    const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
        method: 'PATCH',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to mark all notifications as read');
    return response.json();
};

export const getCompanyDetails = async (companyId) => {
    const response = await fetch(`${API_URL}/candidates/companies/${companyId}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch company details');
    return response.json();
};

export const getCompanyJobsByCompanyId = async (companyId, page = 1, pageSize = 20) => {
    const params = new URLSearchParams({ page, pageSize });
    
    const response = await fetch(`${API_URL}/candidates/companies/${companyId}/jobs?${params}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch company jobs');
    return response.json();
};

// Candidate Profile APIs
export const getCandidateProfile = async () => {
    const response = await fetch(`${API_URL}/candidate/profile`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch candidate profile');
    return response.json();
};

export const getPublicCandidateProfile = async (candidateId) => {
    const response = await fetch(`${API_URL}/candidate/profile/${candidateId}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch public profile');
    return response.json();
};

export const updateCandidateProfile = async (profileData) => {
    const response = await fetch(`${API_URL}/candidate/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(profileData)
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
};

export const updateProfilePicture = async (profilePicture) => {
    const response = await fetch(`${API_URL}/candidate/profile/picture`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ profilePicture })
    });
    if (!response.ok) throw new Error('Failed to update profile picture');
    return response.json();
};

export const updateResume = async (resumeUrl) => {
    const response = await fetch(`${API_URL}/candidate/profile/resume`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ resumeUrl })
    });
    if (!response.ok) throw new Error('Failed to update resume');
    return response.json();
};

export const deleteResume = async () => {
    const response = await fetch(`${API_URL}/candidate/profile/resume`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete resume');
    return response.json();
};

// Work Experience APIs
export const getWorkExperiences = async () => {
    const response = await fetch(`${API_URL}/candidate/profile/experience`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch work experiences');
    return response.json();
};

export const createWorkExperience = async (experienceData) => {
    const response = await fetch(`${API_URL}/candidate/profile/experience`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(experienceData)
    });
    if (!response.ok) throw new Error('Failed to create work experience');
    return response.json();
};

export const updateWorkExperience = async (experienceId, experienceData) => {
    const response = await fetch(`${API_URL}/candidate/profile/experience/${experienceId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(experienceData)
    });
    if (!response.ok) throw new Error('Failed to update work experience');
    return response.json();
};

export const deleteWorkExperience = async (experienceId) => {
    const response = await fetch(`${API_URL}/candidate/profile/experience/${experienceId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete work experience');
    return response.json();
};

// Education APIs
export const getEducations = async () => {
    const response = await fetch(`${API_URL}/candidate/profile/education`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch educations');
    return response.json();
};

export const createEducation = async (educationData) => {
    const response = await fetch(`${API_URL}/candidate/profile/education`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(educationData)
    });
    if (!response.ok) throw new Error('Failed to create education');
    return response.json();
};

export const updateEducation = async (educationId, educationData) => {
    const response = await fetch(`${API_URL}/candidate/profile/education/${educationId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(educationData)
    });
    if (!response.ok) throw new Error('Failed to update education');
    return response.json();
};

export const deleteEducation = async (educationId) => {
    const response = await fetch(`${API_URL}/candidate/profile/education/${educationId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete education');
    return response.json();
};

// Certification APIs
export const getCertifications = async () => {
    const response = await fetch(`${API_URL}/candidate/profile/certifications`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch certifications');
    return response.json();
};

export const createCertification = async (certificationData) => {
    const response = await fetch(`${API_URL}/candidate/profile/certifications`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(certificationData)
    });
    if (!response.ok) throw new Error('Failed to create certification');
    return response.json();
};

export const updateCertification = async (certificationId, certificationData) => {
    const response = await fetch(`${API_URL}/candidate/profile/certifications/${certificationId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(certificationData)
    });
    if (!response.ok) throw new Error('Failed to update certification');
    return response.json();
};

export const deleteCertification = async (certificationId) => {
    const response = await fetch(`${API_URL}/candidate/profile/certifications/${certificationId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete certification');
    return response.json();
};

// Skills API
export const updateSkills = async (skills) => {
    const response = await fetch(`${API_URL}/candidate/profile/skills`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ skills })
    });
    if (!response.ok) throw new Error('Failed to update skills');
    return response.json();
};
