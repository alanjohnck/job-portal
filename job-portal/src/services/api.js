const API_URL = import.meta.env.VITE_API_URL + '/api/v1';

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
