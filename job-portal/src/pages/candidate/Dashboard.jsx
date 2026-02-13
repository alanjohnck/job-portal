import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import './Dashboard.css';
import { FaBriefcase, FaUser, FaCog, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaBookmark, FaBell, FaClipboardCheck, FaArrowRight, FaSignOutAlt } from 'react-icons/fa';
import JobCard from './components/JobCard';
import { useNavigate } from 'react-router-dom';
import { getMyApplications, getSavedJobs } from '../../services/api';

const MockTest = ({ testName, onComplete }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});

    const questions = [
        { id: 1, q: "What is React?", options: ["Library", "Framework", "Language", "OS"] },
        { id: 2, q: "What is JSX?", options: ["XML like syntax", "JavaScript Extension", "Both A and B", "None"] },
        { id: 3, q: "Which hook is used for state?", options: ["useEffect", "useState", "useContext", "useRef"] }
    ];

    const handleSelect = (idx) => {
        setAnswers({ ...answers, [questions[step].id]: idx });
    };

    if (step >= questions.length) {
        return (
            <div className="test-success-card">
                <FaCheckCircle className="success-icon-large" />
                <h3>Test Completed!</h3>
                <p>Your results have been sent to the company.</p>
                <button className="primary-btn" onClick={onComplete}>Back to Dashboard</button>
            </div>
        );
    }

    return (
        <div className="mock-test-container">
            <h3>{testName}</h3>
            <div className="test-progress">Question {step + 1} of {questions.length}</div>
            <div className="question-box">
                <p className="question-text">{questions[step].q}</p>
                <div className="options-grid">
                    {questions[step].options.map((opt, i) => (
                        <button key={i} className={`option-btn ${answers[questions[step].id] === i ? 'selected' : ''}`} onClick={() => handleSelect(i)}>
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
            <button className="next-btn" disabled={answers[questions[step].id] === undefined} onClick={() => setStep(step + 1)}>
                {step === questions.length - 1 ? 'Submit Test' : 'Next Question'} <FaArrowRight />
            </button>
        </div>
    );
};

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [showTest, setShowTest] = useState(null);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Mock Notifications
    const notifications = [
        { id: 1, title: 'Interview Scheduled', msg: 'Google Inc. invited you for a technical round.', type: 'invite', date: 'Just now' },
        { id: 2, title: 'Mock Test Available', msg: 'Please complete the assessment for Frontend Dev role.', type: 'test', date: '2h ago', testName: 'React & JS Basics' },
        { id: 3, title: 'Application Viewed', msg: 'Apple Inc. reviewed your application.', type: 'update', date: '1d ago' }
    ];

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError('');

            const [applicationsRes, savedRes] = await Promise.all([
                getMyApplications(null, 1, 10),
                getSavedJobs()
            ]);

            if (applicationsRes.success && applicationsRes.data?.items) {
                setAppliedJobs(applicationsRes.data.items);
            }

            if (savedRes.success) {
                setSavedJobs(savedRes.data || []);
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const mapApplicationToJobCard = (application) => ({
        id: application.job?.id,
        title: application.job?.title || 'Job Title',
        company: application.job?.company?.name || 'Company',
        logo: application.job?.company?.logo,
        jobType: 'Full-time',
        location: 'Remote'
    });

    const interviewCount = appliedJobs.filter(a => a.status === 'Interviewing').length;

    const renderContent = () => {
        if (showTest) return <MockTest testName={showTest} onComplete={() => { setShowTest(null); setActiveTab('overview'); }} />;

        if (loading) {
            return <div className="loading-message">Loading dashboard...</div>;
        }

        if (error) {
            return <div className="error-message">{error}</div>;
        }

        switch (activeTab) {
            case 'overview':
                return (
                    <div className="dashboard-section">
                        <div className="stats-grid">
                            <div className="stat-card blue">
                                <div className="stat-value">{appliedJobs.length}</div>
                                <div className="stat-label">Applied Jobs</div>
                                <div className="stat-icon"><FaBriefcase /></div>
                            </div>
                            <div className="stat-card purple">
                                <div className="stat-value">{savedJobs.length}</div>
                                <div className="stat-label">Saved Jobs</div>
                                <div className="stat-icon"><FaBookmark /></div>
                            </div>
                            <div className="stat-card green">
                                <div className="stat-value">{interviewCount}</div>
                                <div className="stat-label">Interviews</div>
                                <div className="stat-icon"><FaCheckCircle /></div>
                            </div>
                        </div>

                        <div className="section-header">
                            <h3>Recent Applications</h3>
                        </div>
                        <div className="applications-list">
                            {appliedJobs.slice(0, 5).map(app => (
                                <div key={app.id} className="application-row">
                                    <div className="app-job-info">
                                        <div className="app-logo">
                                            {app.job?.company?.logo ? (
                                                <img src={app.job.company.logo} alt="" />
                                            ) : (
                                                app.job?.company?.name ? app.job.company.name[0] : 'C'
                                            )}
                                        </div>
                                        <div>
                                            <div className="app-title">{app.job?.title}</div>
                                            <div className="app-company">{app.job?.company?.name}</div>
                                        </div>
                                    </div>
                                    <div className="app-date">Applied: {formatDate(app.appliedAt)}</div>
                                    <div className={`app-status ${(app.status || 'Applied').toLowerCase()}`}>
                                        {app.status || 'Applied'}
                                    </div>
                                    <button className="view-btn-sm">View Details</button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'applied':
                return (
                    <div className="dashboard-section">
                        <h3>My Applications</h3>
                        <div className="applications-grid">
                            {appliedJobs.map(app => (
                                <JobCard key={app.id} job={mapApplicationToJobCard(app)} view="list" />
                            ))}
                        </div>
                    </div>
                );
            case 'saved':
                return (
                    <div className="dashboard-section">
                        <h3>Saved Jobs</h3>
                        <div className="jobs-grid">
                            {savedJobs.map(job => (
                                <JobCard key={job.id} job={job} view="grid" />
                            ))}
                        </div>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h3>Notifications</h3>
                            <button className="text-btn">Mark all as read</button>
                        </div>
                        <div className="notifications-list">
                            {notifications.map(notif => (
                                <div key={notif.id} className="notif-card">
                                    <div className={`notif-icon ${notif.type}`}><FaBell /></div>
                                    <div className="notif-content">
                                        <div className="notif-header">
                                            <strong>{notif.title}</strong>
                                            <span className="notif-date">{notif.date}</span>
                                        </div>
                                        <p>{notif.msg}</p>
                                        {notif.type === 'test' && (
                                            <button className="notif-action-btn" onClick={() => setShowTest(notif.testName)}>
                                                Attempt Test <FaArrowRight />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div className="dashboard-section">
                        <h3>Account Settings</h3>
                        <div className="settings-form-grid">
                            <div className="form-group">
                                <label>Email Notifications</label>
                                <div className="toggle-row">
                                    <span>Job Alerts</span>
                                    <input type="checkbox" defaultChecked />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Account Privacy</label>
                                <div className="toggle-row">
                                    <span>Public Profile</span>
                                    <input type="checkbox" defaultChecked />
                                </div>
                            </div>
                            <button className="save-btn-settings">Update Preferences</button>
                            <hr />
                            <button className="danger-btn-settings">Delete Account</button>
                        </div>
                    </div>
                );
            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <div className="dashboard-page">
            <Header />
            <div className="container dashboard-container">
                <aside className="dashboard-sidebar">
                    <div className="user-short-profile">
                        <div className="user-avatar-lg">JD</div>
                        <div className="user-name">John Doe</div>
                        <div className="user-role">Product Designer</div>
                    </div>

                    <nav className="dash-nav">
                        <button
                            className={`dash-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            <FaBriefcase /> Overview
                        </button>
                        <button
                            className={`dash-nav-item ${activeTab === 'applied' ? 'active' : ''}`}
                            onClick={() => setActiveTab('applied')}
                        >
                            <FaCheckCircle /> Applied Jobs
                        </button>
                        <button
                            className={`dash-nav-item ${activeTab === 'saved' ? 'active' : ''}`}
                            onClick={() => setActiveTab('saved')}
                        >
                            <FaBookmark /> Saved Jobs
                        </button>
                        <button
                            className={`dash-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                            onClick={() => setActiveTab('notifications')}
                        >
                            <FaBell /> Notifications
                        </button>
                        <button className="dash-nav-item" onClick={() => navigate('/candidate/profile')}>
                            <FaUser /> My Profile
                        </button>
                        <button
                            className={`dash-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            <FaCog /> Settings
                        </button>
                    </nav>

                    <div className="dash-nav-footer">
                        <button className="logout-btn" onClick={() => navigate('/login')}>
                            <FaSignOutAlt /> Sign Out
                        </button>
                    </div>
                </aside>

                <main className="dashboard-main">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
