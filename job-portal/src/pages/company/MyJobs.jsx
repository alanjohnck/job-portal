import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyNavbar from './components/CompanyNavbar';
import CompanySidebar from './components/CompanySidebar';
import { FaEllipsisV, FaCheckCircle, FaTimesCircle, FaUsers, FaChevronLeft, FaChevronRight, FaPlusCircle, FaEye, FaBan } from 'react-icons/fa';
import { getCompanyJobs } from '../../services/api';
import { formatDate } from '../../utils/formatters';
import './MyJobs.css';

const MyJobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [showMenu, setShowMenu] = useState(null);

    useEffect(() => {
        fetchJobs();
    }, [statusFilter]);

    const fetchJobs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCompanyJobs(statusFilter || null);
            if (response.success && response.data) {
                setJobs(response.data.items || []);
            }
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setError('Failed to load jobs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewApplications = (jobId) => {
        navigate(`/company/applications/${jobId}`);
    };

    const getTimeRemaining = (deadline) => {
        if (!deadline) return 'No deadline';
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'Expired';
        if (diffDays === 0) return 'Today';
        return `${diffDays} days remaining`;
    };

    return (
        <div className="comp-layout">
            <CompanyNavbar />
            <div className="comp-container">
                <div className="container comp-flex">
                    <CompanySidebar />

                    <main className="comp-main-content">
                        <div className="my-jobs-header">
                            <div className="header-left">
                                <h1>My Jobs <span className="count-badge">({jobs.length})</span></h1>
                            </div>
                            <div className="header-right">
                                <label>Job status</label>
                                <select 
                                    className="status-select"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="">All Jobs</option>
                                    <option value="Active">Active</option>
                                    <option value="Closed">Closed</option>
                                    <option value="Draft">Draft</option>
                                </select>
                            </div>
                        </div>

                        {loading && (
                            <div className="loading-message">Loading jobs...</div>
                        )}

                        {error && (
                            <div className="error-message">{error}</div>
                        )}

                        {!loading && !error && jobs.length === 0 && (
                            <div className="empty-state">
                                <p>No jobs found. <button onClick={() => navigate('/company/post-job')} style={{color: '#7c3aed', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer'}}>Post a job</button></p>
                            </div>
                        )}

                        {!loading && !error && jobs.length > 0 && (
                        <div className="premium-table-card">
                            <table className="jobs-data-table">
                                <thead>
                                    <tr>
                                        <th>JOBS</th>
                                        <th>STATUS</th>
                                        <th>APPLICATIONS</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map((job) => (
                                        <tr key={job.id}>
                                            <td>
                                                <div className="job-cell-info">
                                                    <span className="job-title-text">{job.title}</span>
                                                    <span className="job-sub-text">{job.jobType} • {getTimeRemaining(job.deadline)}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-tag ${job.status.toLowerCase()}`}>
                                                    {job.status === 'Active' ? <FaCheckCircle className="icon" /> : <FaTimesCircle className="icon" />}
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="apps-info">
                                                    <FaUsers className="icon" /> {job.applicationsCount || 0} Applications
                                                </div>
                                            </td>
                                            <td>
                                                <div className="actions-cell-flex">
                                                    <button 
                                                        className="view-apps-btn-premium"
                                                        onClick={() => handleViewApplications(job.id)}
                                                    >
                                                        View Applications
                                                    </button>
                                                    <div className="more-menu-container">
                                                        <button
                                                            className="dots-btn"
                                                            onClick={() => setShowMenu(showMenu === job.id ? null : job.id)}
                                                        >
                                                            <FaEllipsisV />
                                                        </button>
                                                        {showMenu === job.id && (
                                                            <div className="dropdown-menu-premium">
                                                                <button><FaPlusCircle /> Promote Job</button>
                                                                <button><FaEye /> View Detail</button>
                                                                <button><FaBan /> Make it Expire</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        )}

                        <div className="pagination-comp">
                            <button className="page-arrow"><FaChevronLeft /></button>
                            <button className="page-number active">01</button>
                            <button className="page-number">02</button>
                            <button className="page-number">03</button>
                            <button className="page-number">04</button>
                            <button className="page-number">05</button>
                            <button className="page-arrow"><FaChevronRight /></button>
                        </div>

                        <footer className="comp-footer-minimal">
                            <p>© 2021 Jobpilot - Job Board. All rights Reserved</p>
                        </footer>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MyJobs;