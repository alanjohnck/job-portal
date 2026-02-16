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
    const result = await response.json();
    return result.data || result;
};

export const getJobDetails = async (id) => {
    const response = await fetch(`${API_URL}/candidates/jobs/${id}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch job details');
    const result = await response.json();
    return result.data || result;
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
    const result = await response.json();
    return result.data || result;
};

export const getCompanyDashboard = async () => {
    const response = await fetch(`${API_URL}/companies/dashboard`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    const result = await response.json();
    return result.data || result;
};

export const getCompanyProfile = async () => {
    const response = await fetch(`${API_URL}/companies/profile`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch company profile');
    const result = await response.json();
    return result.data || result;
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

// Project APIs
export const getProjects = async () => {
    const response = await fetch(`${API_URL}/candidate/profile/projects`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
};

export const createProject = async (projectData) => {
    const response = await fetch(`${API_URL}/candidate/profile/projects`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(projectData)
    });
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
};

export const updateProject = async (projectId, projectData) => {
    const response = await fetch(`${API_URL}/candidate/profile/projects/${projectId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(projectData)
    });
    if (!response.ok) throw new Error('Failed to update project');
    return response.json();
};

export const deleteProject = async (projectId) => {
    const response = await fetch(`${API_URL}/candidate/profile/projects/${projectId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete project');
    return response.json();
};
// Mock Test APIs
export const createMockTest = async (testData) => {
    const response = await fetch(`${API_URL}/mock-tests`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(testData)
    });
    if (!response.ok) throw new Error('Failed to create mock test');
    return response.json();
};

export const updateMockTest = async (testId, testData) => {
    const response = await fetch(`${API_URL}/mock-tests/${testId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(testData)
    });
    if (!response.ok) throw new Error('Failed to update mock test');
    return response.json();
};

export const getCompanyMockTests = async (status, jobId) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (jobId) params.append('jobId', jobId);

    const response = await fetch(`${API_URL}/mock-tests/company?${params}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch mock tests');
    return response.json();
};

export const getMockTestDetails = async (testId) => {
    const response = await fetch(`${API_URL}/mock-tests/${testId}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch mock test details');
    return response.json();
};

export const deleteMockTest = async (testId) => {
    const response = await fetch(`${API_URL}/mock-tests/${testId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete mock test');
    return response.json();
};

export const getAvailableTests = async () => {
    const response = await fetch(`${API_URL}/mock-tests/available`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch available tests');
    return response.json();
};

export const submitTestResult = async (testId, score) => {
    const response = await fetch(`${API_URL}/mock-tests/${testId}/submit`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ score })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to submit test result');
    }
    return data;
};

export const getTestResults = async (testId) => {
    const response = await fetch(`${API_URL}/mock-tests/${testId}/results`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch test results');
    return response.json();
};

// Admin APIs
export const getAdminDashboardStats = async () => {
    const response = await fetch(`${API_URL}/admin/dashboard`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch admin dashboard stats');
    const result = await response.json();
    return result.data || result;
};

export const getAdminRecentActivity = async (limit = 20) => {
    const params = new URLSearchParams({ limit: limit.toString() });
    const response = await fetch(`${API_URL}/admin/activity?${params}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch recent activity');
    const result = await response.json();
    return result.data || result;
};

export const getAdminUsers = async (role, status, search, page = 1, pageSize = 20) => {
    const params = new URLSearchParams({ page, pageSize });
    if (role) params.append('role', role);
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    const response = await fetch(`${API_URL}/admin/users?${params}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    const result = await response.json();
    // Extract data.items from the response structure
    return result.data || result;
};

export const toggleUserStatus = async (userId, isActive) => {
    const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(isActive)
    });
    if (!response.ok) throw new Error('Failed to toggle user status');
    const result = await response.json();
    return result.data || result;
};

export const deleteJobByAdmin = async (jobId) => {
    const response = await fetch(`${API_URL}/admin/jobs/${jobId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete job');
    const result = await response.json();
    return result.data || result;
};

export const getAdminSupportTickets = async (status, priority, type, page = 1, pageSize = 20) => {
    const params = new URLSearchParams({ page, pageSize });
    if (status) params.append('status', status);
    if (priority) params.append('priority', priority);
    if (type) params.append('type', type);

    const response = await fetch(`${API_URL}/admin/support-tickets?${params}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch support tickets');
    const result = await response.json();
    return result.data || result;
};

export const updateTicketStatus = async (ticketId, status) => {
    const response = await fetch(`${API_URL}/admin/support-tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(status)
    });
    if (!response.ok) throw new Error('Failed to update ticket status');
    const result = await response.json();
    return result.data || result;
};

// Support Ticket APIs (for Candidates and Companies)
export const createSupportTicket = async (ticketData) => {
    const response = await fetch(`${API_URL}/support/tickets`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(ticketData)
    });
    if (!response.ok) throw new Error('Failed to create support ticket');
    const result = await response.json();
    return result.data || result;
};

export const getMySupportTickets = async (status, page = 1, pageSize = 20) => {
    const params = new URLSearchParams({ page, pageSize });
    if (status) params.append('status', status);

    const response = await fetch(`${API_URL}/support/my-tickets?${params}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch support tickets');
    const result = await response.json();
    return result.data || result;
};

export const getSupportTicketDetails = async (ticketId) => {
    const response = await fetch(`${API_URL}/support/tickets/${ticketId}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch ticket details');
    const result = await response.json();
    return result.data || result;
};
