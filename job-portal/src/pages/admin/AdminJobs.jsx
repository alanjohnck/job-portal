import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import { FaSearch, FaBriefcase, FaBuilding, FaTrashAlt, FaEye } from 'react-icons/fa';
import { getJobs, deleteJobByAdmin } from '../../services/api';
import './AdminJobs.css';

const AdminJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await getJobs({ keyword: searchTerm });
            console.log('Admin Jobs API Response:', data);
            console.log('Extracted jobs:', data.items || data || []);
            setJobs(data.items || data || []);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch jobs:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    const handleDeleteJob = async (jobId) => {
        if (!confirm('Are you sure you want to delete this job posting?')) return;

        try {
            await deleteJobByAdmin(jobId);
            fetchJobs();
        } catch (err) {
            console.error('Failed to delete job:', err);
            alert('Failed to delete job: ' + err.message);
        }
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        const days = Math.floor(seconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <main className="admin-main">
                <div className="admin-page-header">
                    <div className="header-left">
                        <h1>Platform Job Postings</h1>
                        <p>Currently {jobs.length} active job listings across the platform.</p>
                    </div>
                    <form onSubmit={handleSearch} className="header-search">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by job title or company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                </div>

                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <p>Loading jobs...</p>
                    </div>
                ) : error ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
                        <p>Error loading jobs: {error}</p>
                        <button onClick={fetchJobs} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Job Title</th>
                                    <th>Company</th>
                                    <th>Employment Type</th>
                                    <th>Salary Range</th>
                                    <th>Location</th>
                                    <th>Posted Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.length > 0 ? jobs.map((j) => (
                                    <tr key={j.id}>
                                        <td>
                                            <div className="job-title-cell">
                                                <FaBriefcase className="job-icon-admin" />
                                                <span className="user-name">{j.title}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="company-info-small">
                                                <FaBuilding size={12} />
                                                <span>{j.companyName || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td><span className="type-tag">{j.employmentType || 'Full Time'}</span></td>
                                        <td><span className="salary-text">{j.salaryRange || 'Not specified'}</span></td>
                                        <td><span className="date-text">{j.location || 'Remote'}</span></td>
                                        <td><span className="date-text">{formatTimeAgo(j.postedDate || j.createdAt)}</span></td>
                                        <td>
                                            <div className="action-buttons-flex">
                                                <button className="icon-btn info" title="View Job Details"><FaEye /></button>
                                                <button
                                                    className="icon-btn deactivate"
                                                    title="Remove Listing"
                                                    onClick={() => handleDeleteJob(j.id)}
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                            No jobs found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminJobs;
