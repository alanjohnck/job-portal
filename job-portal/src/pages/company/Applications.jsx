import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CompanyNavbar from './components/CompanyNavbar';
import CompanySidebar from './components/CompanySidebar';
import { FaEllipsisH, FaDownload, FaPlus, FaChevronRight, FaEdit, FaTrashAlt, FaLink } from 'react-icons/fa';
import { getJobApplications, updateApplicationStatus } from '../../services/api';
import { formatDate } from '../../utils/formatters';
import './Applications.css';

const Applications = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSort, setShowSort] = useState(false);
    const [activeColMenu, setActiveColMenu] = useState(null);
    const [jobTitle, setJobTitle] = useState('Job');
    const [updatingAppId, setUpdatingAppId] = useState(null);

    const statusOptions = ['Applied', 'Shortlisted', 'Interviewed', 'Offered', 'Rejected', 'Hired'];

    useEffect(() => {
        if (!jobId) {
            fetchDefaultJob();
        } else {
            fetchApplications(jobId);
        }
    }, [jobId]);

    const fetchDefaultJob = async () => {
        try {
            // If no jobId in URL, redirect to company jobs page
            navigate('/company/my-jobs');
        } catch (err) {
            setError('Failed to load applications');
            setLoading(false);
        }
    };

    const fetchApplications = async (selectedJobId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getJobApplications(selectedJobId);

            if (response.success && response.data) {
                const applications = response.data.items || [];

                const columnMap = new Map();
                statusOptions.forEach(status => columnMap.set(status, []));

                applications.forEach(app => {
                    const status = app.status || 'Applied';
                    if (!columnMap.has(status)) {
                        columnMap.set(status, []);
                    }

                    columnMap.get(status).push({
                        id: app.id,
                        candidateId: app.candidate?.id,
                        name: `${app.candidate.firstName} ${app.candidate.lastName}`,
                        initials: `${app.candidate.firstName?.[0] || ''}${app.candidate.lastName?.[0] || ''}`,
                        role: app.candidate.currentJobTitle || 'Candidate',
                        exp: app.candidate.experienceYears ? `${app.candidate.experienceYears} Years Experience` : 'N/A',
                        edu: app.candidate.education || 'N/A',
                        applied: formatDate(app.appliedAt),
                        image: app.candidate.profilePicture,
                        resumeUrl: app.resumeUrl,
                        coverLetter: app.coverLetter,
                        status: status,
                        email: app.candidate.email,
                        skills: app.candidate.skills || []
                    });
                });

                const columnsArray = Array.from(columnMap.entries()).map(([title, apps]) => ({
                    title,
                    count: apps.length,
                    applications: apps
                }));

                setColumns(columnsArray);
            }
        } catch (err) {
            console.error('Error fetching applications:', err);
            setError('Failed to load applications. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadResume = (resumeUrl, candidateName) => {
        if (resumeUrl) {
            // Open resume in new tab or trigger download
            window.open(resumeUrl, '_blank');
        } else {
            alert(`Resume not available for ${candidateName}`);
        }
    };

    const handleStatusChange = async (applicationId, status) => {
        if (!applicationId || !status) return;
        try {
            setUpdatingAppId(applicationId);
            await updateApplicationStatus(applicationId, status, status);
            await fetchApplications(jobId);
        } catch (err) {
            console.error('Error updating application status:', err);
            alert('Failed to update status. Please try again.');
        } finally {
            setUpdatingAppId(null);
        }
    };

    return (
        <div className="comp-layout">
            <CompanyNavbar />
            <div className="comp-container">
                <div className="container comp-flex">
                    <CompanySidebar />

                    <main className="comp-main-content">
                        <nav className="breadcrumb">
                            <span onClick={() => navigate('/company/dashboard')} style={{ cursor: 'pointer' }}>Home</span> <FaChevronRight size={10} />
                            <span onClick={() => navigate('/company/my-jobs')} style={{ cursor: 'pointer' }}>Jobs</span> <FaChevronRight size={10} />
                            <span className="active">Applications</span>
                        </nav>

                        <div className="apps-page-header">
                            <h1>Job Applications</h1>
                            <div className="header-actions">
                                <span className="filter-text">Filter</span>
                                <div className="sort-container">
                                    <button className="sort-btn" onClick={() => setShowSort(!showSort)}>
                                        Sort <span className="active-sort">Newest</span>
                                    </button>
                                    {showSort && (
                                        <div className="sort-dropdown">
                                            <p className="dropdown-title">SORT APPLICATION</p>
                                            <label className="sort-option">
                                                <input type="radio" name="sort" defaultChecked />
                                                <span>Newest</span>
                                            </label>
                                            <label className="sort-option">
                                                <input type="radio" name="sort" />
                                                <span>Oldest</span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {loading && (
                            <div className="loading-message">Loading applications...</div>
                        )}

                        {error && (
                            <div className="error-message">{error}</div>
                        )}

                        {!loading && !error && columns.length === 0 && (
                            <div className="empty-state">
                                <p>No applications received yet.</p>
                            </div>
                        )}

                        {!loading && !error && columns.length > 0 && (
                            <div className="kanban-wrapper">
                                {columns.map((column, colIdx) => (
                                    <div key={colIdx} className="kanban-column">
                                        <div className="column-header">
                                            <h3>{column.title} ({column.count})</h3>
                                            <div className="col-menu-wrap">
                                                <button className="col-more-btn" onClick={() => setActiveColMenu(activeColMenu === colIdx ? null : colIdx)}>
                                                    <FaEllipsisH />
                                                </button>
                                                {activeColMenu === colIdx && (
                                                    <div className="col-dropdown">
                                                        <button><FaEdit /> Edit Column</button>
                                                        <button className="delete"><FaTrashAlt /> Delete</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="cards-container">
                                            {column.applications.map((app) => (
                                                <div key={app.id} className="app-card-premium">
                                                    <div className="card-top">
                                                        {app.image ? (
                                                            <img src={app.image} alt={app.name} className="candidate-avatar" />
                                                        ) : (
                                                            <div className="candidate-avatar initials-box">
                                                                {app.initials}
                                                            </div>
                                                        )}
                                                        <div className="candidate-info">
                                                            <h4>{app.name}</h4>
                                                            <p>{app.role}</p>
                                                            {app.email && <p className="candidate-email">{app.email}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="card-details">
                                                        <div className="detail-item">
                                                            <span className="dot"></span> {app.exp}
                                                        </div>
                                                        <div className="detail-item">
                                                            <span className="dot"></span> Education: {app.edu}
                                                        </div>
                                                        <div className="detail-item">
                                                            <span className="dot"></span> Applied: {app.applied}
                                                        </div>
                                                        {app.skills && app.skills.length > 0 && (
                                                            <div className="detail-item">
                                                                <span className="dot"></span> Skills: {app.skills.slice(0, 3).join(', ')}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="card-footer">
                                                        <div className="card-footer-actions">
                                                            <button
                                                                className="view-profile-btn"
                                                                onClick={() => {
                                                                    if (app.candidateId) {
                                                                        // Open in new tab as requested
                                                                        window.open(`/company/candidate/${app.candidateId}`, '_blank');
                                                                    }
                                                                }}
                                                                disabled={!app.candidateId}
                                                                title={app.candidateId ? 'View full profile' : 'Profile unavailable'}
                                                            >
                                                                View Profile
                                                            </button>

                                                            {app.coverLetter && app.coverLetter.includes('[Portfolio Shared]') && (
                                                                <button
                                                                    className="view-profile-btn"
                                                                    style={{ backgroundColor: '#8b5cf6', color: 'white', border: 'none', marginLeft: '5px' }}
                                                                    onClick={() => window.open(`/portfolio/${app.candidateId}`, '_blank')}
                                                                    title="Candidate shared their portfolio"
                                                                >
                                                                    <FaLink /> Portfolio
                                                                </button>
                                                            )}

                                                            <div className="status-control">
                                                                <span>Move to</span>
                                                                <select
                                                                    className="status-select"
                                                                    value={app.status || 'Applied'}
                                                                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                                                    disabled={updatingAppId === app.id}
                                                                >
                                                                    {statusOptions.map((status) => (
                                                                        <option key={status} value={status}>{status}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <button
                                                                className="download-cv-btn"
                                                                onClick={() => handleDownloadResume(app.resumeUrl, app.name)}
                                                                disabled={!app.resumeUrl}
                                                                title={app.resumeUrl ? 'Download Resume' : 'Resume not available'}
                                                            >
                                                                <FaDownload /> {app.resumeUrl ? 'Download CV' : 'No Resume'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <footer className="comp-footer-minimal">
                            <p>© 2021 Jobpilot - Job Board. All rights Reserved</p>
                        </footer>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Applications;
