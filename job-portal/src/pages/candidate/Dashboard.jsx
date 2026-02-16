import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import './Dashboard.css';
import { FaBriefcase, FaUser, FaCog, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaBookmark, FaBell, FaClipboardCheck, FaArrowRight, FaSignOutAlt } from 'react-icons/fa';
import JobCard from './components/JobCard';
import { useNavigate } from 'react-router-dom';
import { getAvailableTests, getMockTestDetails, submitTestResult, getMyApplications, getSavedJobs, getNotifications, markAllNotificationsRead } from '../../services/api';

const MockTest = ({ testId, testTitle, onComplete }) => {
    const [step, setStep] = useState(-1); // -1: Start Screen, 0-N: Questions
    const [answers, setAnswers] = useState({});
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [score, setScore] = useState(null);
    const [testDetails, setTestDetails] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0); // in seconds
    const [timerActive, setTimerActive] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const loadTest = async () => {
            try {
                const res = await getMockTestDetails(testId);
                if (res.success && res.data) {
                    setQuestions(res.data.questions || []);
                    setTestDetails(res.data);
                    // Initialize timer based on duration (convert minutes to seconds)
                    if (res.data.durationMinutes) {
                        setTimeLeft(res.data.durationMinutes * 60);
                    }
                }
            } catch (err) {
                console.error(err);
                setErrorMsg('Failed to load test details.');
            } finally {
                setLoading(false);
            }
        };
        if (testId) loadTest();
    }, [testId]);

    useEffect(() => {
        let interval = null;
        if (timerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(interval);
                        handleSubmit(); // Auto-submit
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timerActive, timeLeft]);

    const handleStartTest = () => {
        setStep(0);
        setTimerActive(true);
    };

    const handleSelect = (questionId, optionId, isCorrect, points) => {
        setAnswers({ ...answers, [questionId]: { optionId, isCorrect, points } });
    };

    const handleSubmit = async () => {
        setTimerActive(false);
        setSubmitting(true);
        setErrorMsg('');
        let calculatedScore = 0;
        Object.values(answers).forEach(ans => {
            if (ans.isCorrect) calculatedScore += ans.points;
        });

        try {
            const res = await submitTestResult(testId, calculatedScore);
            if (res.success) {
                setScore(calculatedScore);
            } else {
                setErrorMsg(res.message || 'Failed to submit test.');
                setSubmitting(false); // Allow retry if failed
                // setTimerActive(true); // Resume timer if failed? No, maybe just stop.
            }
        } catch (err) {
            console.error(err);
            setErrorMsg('An error occurred. Please try again.');
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (loading) return <div className="test-loading">Loading test content...</div>;

    if (score !== null) {
        return (
            <div className="test-success-card">
                <FaCheckCircle className="success-icon-large" />
                <h3>Test Completed!</h3>
                <div className="score-summary">
                    <p>You scored <strong>{score}</strong> out of <strong>{questions.reduce((acc, q) => acc + q.points, 0)}</strong></p>
                </div>
                <button className="primary-btn" onClick={onComplete}>Back to Dashboard</button>
            </div>
        );
    }

    if (questions.length === 0) return <div>No questions found for this test. <button onClick={onComplete}>Back</button></div>;

    // Start Screen
    if (step === -1) {
        return (
            <div className="mock-test-container start-screen">
                <div className="test-header">
                    <h3>{testTitle}</h3>
                    <span className="badge-info">{testDetails?.durationMinutes} Minutes</span>
                </div>
                {errorMsg && <div className="error-message mb-4">{errorMsg}</div>}
                <div className="test-instructions">
                    <h4>Instructions:</h4>
                    <ul>
                        <li>This test consists of {questions.length} questions.</li>
                        <li>You must answer all questions to submit.</li>
                        <li>Ensure you have a stable internet connection.</li>
                        <li>Do not refresh the page during the test.</li>
                    </ul>
                </div>
                <div className="test-actions">
                    <button className="secondary-btn" onClick={onComplete}>Cancel</button>
                    <button className="primary-btn" onClick={handleStartTest}>Start Test <FaArrowRight /></button>
                </div>
            </div>
        );
    }

    // Current Question
    const currentQ = questions[step];

    return (
        <div className="mock-test-container">
            <div className="test-header-compact">
                <h4>{testTitle}</h4>
                <div className={`timer-placeholder ${timeLeft < 60 ? 'urgent' : ''}`}>
                    <FaHourglassHalf /> {formatTime(timeLeft)}
                </div>
            </div>

            {errorMsg && <div className="error-message mb-4">{errorMsg}</div>}

            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${((step + 1) / questions.length) * 100}%` }}></div>
            </div>
            <div className="test-progress-text">Question {step + 1} of {questions.length}</div>

            <div className="question-box">
                <p className="question-text">{currentQ.questionText}</p>
                <div className="options-list">
                    {currentQ.options.map((opt) => (
                        <div key={opt.id}
                            className={`option-item ${answers[currentQ.id]?.optionId === opt.id ? 'selected' : ''}`}
                            onClick={() => handleSelect(currentQ.id, opt.id, opt.isCorrect, currentQ.points)}>
                            <div className={`radio-circle ${answers[currentQ.id]?.optionId === opt.id ? 'active' : ''}`}>
                                {answers[currentQ.id]?.optionId === opt.id && <div className="inner-dot"></div>}
                            </div>
                            <span className="option-text">{opt.optionText}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="test-footer">
                <button className="prev-btn" disabled={step === 0} onClick={() => setStep(step - 1)}>
                    Previous
                </button>
                {step < questions.length - 1 ? (
                    <button className="next-btn" disabled={!answers[currentQ.id]} onClick={() => setStep(step + 1)}>
                        Next <FaArrowRight />
                    </button>
                ) : (
                    <button className="submit-btn" disabled={!answers[currentQ.id] || submitting} onClick={handleSubmit}>
                        {submitting ? 'Submitting...' : 'Submit Test'} <FaCheckCircle />
                    </button>
                )}
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [showTest, setShowTest] = useState(null); // { id, title }
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [savedJobs, setSavedJobs] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [availableTests, setAvailableTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError('');

            const [applicationsRes, savedRes, notificationsRes, testsRes] = await Promise.all([
                getMyApplications(null, 1, 10),
                getSavedJobs(),
                getNotifications(),
                getAvailableTests() // Fetch tests available to candidate
            ]);

            if (applicationsRes.success && applicationsRes.data?.items) {
                setAppliedJobs(applicationsRes.data.items);
            }

            if (savedRes.success) {
                setSavedJobs(savedRes.data || []);
            }

            if (notificationsRes.success) {
                setNotifications(notificationsRes.data || []);
            }

            if (testsRes.success) {
                setAvailableTests(testsRes.data || []);
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

    const formatNotificationDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return 'N/A';
        return date.toLocaleString();
    };

    const getNotificationClass = (type) => {
        const normalized = (type || '').toLowerCase();
        if (normalized.includes('test')) return 'test';
        if (normalized.includes('invite')) return 'invite';
        return 'update';
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error('Error marking notifications as read:', err);
        }
    };

    const interviewCount = appliedJobs.filter(a => a.status === 'Interviewing').length;

    const renderContent = () => {
        if (showTest) return <MockTest testId={showTest.id} testTitle={showTest.title} onComplete={() => { setShowTest(null); fetchDashboardData(); setActiveTab('overview'); }} />;

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

                        {availableTests.length > 0 && (
                            <div className="dashboard-section assessment-section">
                                <div className="section-header">
                                    <h3>Available Assessments</h3>
                                </div>
                                <div className="table-container">
                                    <table className="custom-table">
                                        <thead>
                                            <tr>
                                                <th>Assessment</th>
                                                <th>Company</th>
                                                <th>Job Role</th>
                                                <th>Status</th>
                                                <th>Result</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {availableTests.map(test => (
                                                <tr key={test.testId}>
                                                    <td>
                                                        <div className="fw-bold">{test.testTitle}</div>
                                                        <div className="text-muted small">{formatDate(test.scheduledDate)}</div>
                                                    </td>
                                                    <td>{test.companyName}</td>
                                                    <td>{test.jobTitle}</td>
                                                    <td>
                                                        <span className={`status-badge ${test.status.toLowerCase().replace(' ', '-')}`}>
                                                            {test.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {test.status === 'Completed' ? (
                                                            <span className={test.hasPassed ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                                                                {test.score !== undefined ? test.score : '-'} / {test.totalPoints || '-'}
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted">-</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {test.status === 'Completed' ? (
                                                            <button className="btn-text disabled">Completed</button>
                                                        ) : (
                                                            <button className="btn-primary-sm" onClick={() => setShowTest({ id: test.testId, title: test.testTitle })}>
                                                                {test.status === 'In Progress' ? 'Resume' : 'Start'}
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

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
                            <button className="text-btn" onClick={handleMarkAllRead} disabled={notifications.length === 0}>
                                Mark all as read
                            </button>
                        </div>
                        <div className="notifications-list">
                            {notifications.length === 0 && (
                                <div className="empty-state">No notifications yet.</div>
                            )}
                            {notifications.map(notif => (
                                <div key={notif.id} className="notif-card">
                                    <div className={`notif-icon ${getNotificationClass(notif.type)}`}><FaBell /></div>
                                    <div className="notif-content">
                                        <div className="notif-header">
                                            <strong>{notif.title}</strong>
                                            <span className="notif-date">{formatNotificationDate(notif.createdAt)}</span>
                                        </div>
                                        <p>{notif.message}</p>
                                        {(notif.type || '').toLowerCase().includes('test') && notif.relatedEntityId && (
                                            <button className="notif-action-btn" onClick={() => setShowTest('Mock Test')}>
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
