import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyNavbar from './components/CompanyNavbar';
import CompanySidebar from './components/CompanySidebar';
import { FaBriefcase, FaUserCheck, FaChevronRight, FaEllipsisV, FaCheckCircle, FaUsers, FaArrowRight } from 'react-icons/fa';
import './CompanyDashboard.css';
import { getCompanyDashboard, getCompanyJobs, getCompanyProfile } from '../../services/api';

const CompanyDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState(null);
    const [recentJobs, setRecentJobs] = useState([]);
    const [companyName, setCompanyName] = useState('Company');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError('');

            // Fetch dashboard stats, recent jobs, and company profile in parallel
            const [dashboardRes, jobsRes, profileRes] = await Promise.all([
                getCompanyDashboard(),
                getCompanyJobs(null, 1, 5),
                getCompanyProfile()
            ]);

            if (dashboardRes.success) {
                setStats(dashboardRes.data);
            }

            if (jobsRes.success && jobsRes.data?.items) {
                setRecentJobs(jobsRes.data.items);
            }

            if (profileRes.success) {
                setCompanyName(profileRes.data.companyName);
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const calculateDaysRemaining = (deadline) => {
        if (!deadline) return null;
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? `${diffDays} days remaining` : 'Expired';
    };

    const handleViewApplications = (jobId) => {
        navigate(`/company/applications/${jobId}`);
    };

    const statsConfig = stats ? [
        { label: 'Active Jobs', value: stats.activeJobs || 0, icon: <FaBriefcase />, color: '#0066ff', bg: '#f0f7ff' },
        { label: 'Total Applications', value: stats.totalApplications || 0, icon: <FaUserCheck />, color: '#ffa500', bg: '#fff7ed' }
    ] : [];

    if (loading) {
        return (
            <div className="comp-layout">
                <CompanyNavbar />
                <div className="comp-container">
                    <div className="container comp-flex">
                        <CompanySidebar />
                        <main className="comp-main-content">
                            <div className="loading-message">Loading dashboard...</div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="comp-layout">
            <CompanyNavbar />
            <div className="comp-container">
                <div className="container comp-flex">
                    <CompanySidebar />

                    <main className="comp-main-content">
                        <section className="overview-section">
                            {error && <div className="error-message">{error}</div>}
                            
                            <div className="welcome-box">
                                <h1>Hello, {companyName}</h1>
                                <p>Here is your daily activities and applications</p>
                            </div>

                            <div className="stats-grid">
                                {statsConfig.map((stat, idx) => (
                                    <div key={idx} className="stat-card-premium" style={{ borderLeft: `4px solid ${stat.color}` }}>
                                        <div className="stat-content">
                                            <span className="stat-value">{stat.value}</span>
                                            <span className="stat-label">{stat.label}</span>
                                        </div>
                                        <div className="stat-icon-box" style={{ background: stat.bg, color: stat.color }}>
                                            {stat.icon}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="jobs-table-section">
                                <div className="section-header-flex">
                                    <h3>Recently Posted Jobs</h3>
                                    <button className="view-all-link" onClick={() => navigate('/company/my-jobs')}>
                                        View all <FaArrowRight />
                                    </button>
                                </div>

                                {recentJobs.length === 0 ? (
                                    <div className="empty-state">
                                        <p>No jobs posted yet. <a href="/company/post-job">Post your first job</a></p>
                                    </div>
                                ) : (
                                    <div className="premium-table-container">
                                        <table className="jobs-table">
                                            <thead>
                                                <tr>
                                                    <th>JOBS</th>
                                                    <th>STATUS</th>
                                                    <th>APPLICATIONS</th>
                                                    <th>ACTIONS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recentJobs.map((job) => (
                                                    <tr key={job.id} className={job.status === 'Active' ? 'active-row' : 'expired-row'}>
                                                        <td>
                                                            <div className="job-info-cell">
                                                                <span className="job-name">{job.title}</span>
                                                                <span className="job-meta">
                                                                    {job.jobType} • {calculateDaysRemaining(job.deadline) || new Date(job.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className={`status-pill ${job.status.toLowerCase()}`}>
                                                                {job.status === 'Active' ? <FaCheckCircle /> : <FaEllipsisV />} {job.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="apps-cell">
                                                                <FaUsers /> {job.applicationsCount || 0} Applications
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="actions-cell">
                                                                <button 
                                                                    className="view-apps-btn"
                                                                    onClick={() => handleViewApplications(job.id)}
                                                                >
                                                                    View Applications
                                                                </button>
                                                                <button className="more-btn"><FaEllipsisV /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </section>
                    </main>
                </div>
            </div>

            <footer className="comp-footer">
                <div className="container">
                    <p>© 2021 Jobpilot - Job Board. All rights Reserved</p>
                </div>
            </footer>
        </div>
    );
};

export default CompanyDashboard;
