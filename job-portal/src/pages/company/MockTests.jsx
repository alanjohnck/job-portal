import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CompanyNavbar from './components/CompanyNavbar';
import CompanySidebar from './components/CompanySidebar';
import { FaPlus, FaCalendarAlt, FaClock, FaCheckCircle, FaUserGraduate, FaChevronRight, FaTrophy, FaEllipsisV, FaBan, FaEye } from 'react-icons/fa';
import './MockTests.css';
import { getCompanyMockTests, createMockTest, getCompanyJobs, getTestResults, updateMockTest } from '../../services/api';

const MockTests = () => {
    const location = useLocation();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'results'
    const [selectedTest, setSelectedTest] = useState(null);
    const [mockTests, setMockTests] = useState([]);
    const [jobs, setJobs] = useState([]); // For dropdown
    const [topCandidates, setTopCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeMenu, setActiveMenu] = useState(null); // Track which menu is open

    const [newTest, setNewTest] = useState({
        title: '',
        jobId: '',
        scheduledDate: '',
        startTime: '',
        durationMinutes: 60,
        passingScore: 70,
        description: '',
        questions: []
    });

    useEffect(() => {
        fetchTests();
        fetchJobs();
    }, []);

    useEffect(() => {
        // Check for jobId in URL
        const queryParams = new URLSearchParams(location.search);
        const jobIdParam = queryParams.get('jobId');
        if (jobIdParam) {
            setNewTest(prev => ({ ...prev, jobId: jobIdParam }));
            setShowCreateModal(true);
        }
    }, [location.search]);

    const fetchTests = async () => {
        setLoading(true);
        try {
            const res = await getCompanyMockTests();
            if (res.success) {
                setMockTests(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchJobs = async () => {
        try {
            // Fetch more jobs to ensure we find the one from the URL if possible
            const res = await getCompanyJobs(null, 1, 100);
            if (res && res.items) {
                setJobs(res.items || []);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateTest = async () => {
        try {
            const payload = {
                ...newTest,
                startTime: newTest.startTime, // Ensure this is string "HH:mm"
                questions: newTest.questions.map((q, i) => ({
                    questionText: q.questionText,
                    points: parseInt(q.points) || 1,
                    orderNumber: i + 1,
                    options: q.options.map((o, j) => ({
                        optionText: o.optionText,
                        orderNumber: j + 1,
                        isCorrect: o.isCorrect
                    }))
                }))
            };

            const res = await createMockTest(payload);
            if (res.success) {
                setShowCreateModal(false);
                fetchTests();
                // Reset form
                setNewTest({
                    title: '',
                    jobId: '',
                    scheduledDate: '',
                    startTime: '',
                    durationMinutes: 60,
                    passingScore: 70,
                    description: '',
                    questions: []
                });
            } else {
                alert('Failed to create test: ' + res.message);
            }
        } catch (err) {
            console.error(err);
            alert('Error creating test');
        }
    };

    const handleViewResults = async (test) => {
        setSelectedTest(test);
        setViewMode('results');
        setActiveMenu(null);
        try {
            const res = await getTestResults(test.id);
            if (res.success && res.data) {
                setTopCandidates(res.data.map(r => ({
                    id: r.id,
                    name: r.candidate.firstName + ' ' + r.candidate.lastName || 'Candidate', // Access correct properties
                    score: `${r.score}`,
                    rank: r.rank,
                    image: r.candidate.profilePicture || 'https://i.pravatar.cc/150'
                })));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleExpireTest = async (test) => {
        if (!window.confirm(`Are you sure you want to expire "${test.title}"? Candidates will no longer be able to take this test.`)) return;

        try {
            // Construct payload required by backend
            const payload = {
                jobId: test.jobId,
                title: test.title,
                description: test.description || '',
                scheduledDate: test.scheduledDate,
                startTime: test.startTime,
                durationMinutes: test.durationMinutes,
                passingScore: test.passingScore,
                status: 'Completed', // Setting status to Completed effectively expires it for taking
                questions: [] // Not updating questions
            };

            const res = await updateMockTest(test.id, payload);
            if (res.success) {
                alert('Test expired successfully');
                fetchTests();
            } else {
                alert('Failed to expire test: ' + res.message);
            }
        } catch (err) {
            console.error(err);
            alert('Error expiring test');
        } finally {
            setActiveMenu(null);
        }
    };

    const getJobName = (jobId) => {
        const job = jobs.find(j => j.id === jobId);
        return job ? job.title : 'Unknown Job';
    };

    // Question Helpers
    const addQuestion = () => {
        setNewTest({
            ...newTest,
            questions: [...newTest.questions, { questionText: '', points: 5, options: [{ optionText: '', isCorrect: false }, { optionText: '', isCorrect: false }] }]
        });
    };

    const removeQuestion = (index) => {
        const updated = [...newTest.questions];
        updated.splice(index, 1);
        setNewTest({ ...newTest, questions: updated });
    };

    const updateQuestion = (index, field, value) => {
        const updated = [...newTest.questions];
        updated[index][field] = value;
        setNewTest({ ...newTest, questions: updated });
    };

    const addOption = (qIndex) => {
        const updated = [...newTest.questions];
        updated[qIndex].options.push({ optionText: '', isCorrect: false });
        setNewTest({ ...newTest, questions: updated });
    };

    const updateOption = (qIndex, oIndex, field, value) => {
        const updated = [...newTest.questions];
        updated[qIndex].options[oIndex][field] = value;
        setNewTest({ ...newTest, questions: updated });
    };

    const setCorrectOption = (qIndex, oIndex) => {
        const updated = [...newTest.questions];
        updated[qIndex].options.forEach((opt, idx) => {
            opt.isCorrect = idx === oIndex;
        });
        setNewTest({ ...newTest, questions: updated });
    };

    return (
        <div className="comp-layout">
            <CompanyNavbar />
            <div className="comp-container">
                <div className="container comp-flex">
                    <CompanySidebar />

                    <main className="comp-main-content">
                        {viewMode === 'list' ? (
                            <>
                                <div className="mock-tests-header">
                                    <div className="header-left">
                                        <h1>Mock Tests Assessment</h1>
                                        <p>Create and manage technical assessments for your job postings.</p>
                                    </div>
                                    <button className="create-test-btn" onClick={() => setShowCreateModal(true)}>
                                        <FaPlus /> Create New Test
                                    </button>
                                </div>

                                <div className="tests-grid">
                                    {mockTests.map((test) => (
                                        <div key={test.id} className="test-card-premium">
                                            <div className="test-card-header">
                                                <div className={`status-tag ${test.status.toLowerCase()}`}>
                                                    {test.status}
                                                </div>
                                                <div className="menu-wrapper">
                                                    <button className="dots-btn-small" onClick={() => setActiveMenu(activeMenu === test.id ? null : test.id)}>
                                                        <FaEllipsisV />
                                                    </button>
                                                    {activeMenu === test.id && (
                                                        <div className="dropdown-menu">
                                                            <button onClick={() => handleViewResults(test)}>
                                                                <FaEye /> View Results
                                                            </button>
                                                            {test.status !== 'Completed' && test.status !== 'Expired' && (
                                                                <button onClick={() => handleExpireTest(test)} className="text-danger">
                                                                    <FaBan /> Expire Test
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="test-card-body">
                                                <h3>{test.title}</h3>
                                                <p className="job-linked">Linked to: <strong>{getJobName(test.jobId)}</strong></p>

                                                <div className="test-meta-grid">
                                                    <div className="meta-item">
                                                        <FaCalendarAlt /> <span>{new Date(test.scheduledDate).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="meta-item">
                                                        <FaClock /> <span>{test.startTime} ({test.durationMinutes} mins)</span>
                                                    </div>
                                                    <div className="meta-item">
                                                        <FaCheckCircle /> <span>{test.totalApplicants} Applicants</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="test-card-footer">
                                                {test.status === 'Completed' || test.status === 'Expired' || test.status === 'Finished' ? (
                                                    <button className="results-btn" onClick={() => handleViewResults(test)}>
                                                        View Top Scored <FaTrophy />
                                                    </button>
                                                ) : (
                                                    <button className="manage-btn">
                                                        Edit Schedule <FaCalendarAlt />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="results-view">
                                <div className="results-header">
                                    <button className="back-to-list" onClick={() => setViewMode('list')}>
                                        ← Back to Assessments
                                    </button>
                                    <div className="results-title-box">
                                        <h1>Top Scored Candidates</h1>
                                        <p>{selectedTest?.title}</p>
                                    </div>
                                </div>

                                <div className="top-candidates-table-wrap">
                                    <table className="results-table">
                                        <thead>
                                            <tr>
                                                <th>Rank</th>
                                                <th>Candidate</th>
                                                <th>Score</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topCandidates.map((c) => (
                                                <tr key={c.id} className={c.rank <= 3 ? 'top-tier' : ''}>
                                                    <td>
                                                        <div className={`rank-badge rank-${c.rank}`}>
                                                            {c.rank === 1 ? <FaTrophy /> : c.rank}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="candidate-cell">
                                                            <div className="candidate-avatar-mini">
                                                                <img src={c.image} alt={c.name} />
                                                            </div>
                                                            <span>{c.name}</span>
                                                        </div>
                                                    </td>
                                                    <td><span className="score-text">{c.score}</span></td>
                                                    <td>
                                                        <button className="hire-process-btn">Start Hiring Process</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {showCreateModal && (
                            <div className="test-modal-overlay">
                                <div className="test-modal-content large-modal">
                                    <div className="modal-header">
                                        <h2>Create Technical Assessment</h2>
                                        <button className="close-modal" onClick={() => setShowCreateModal(false)}>&times;</button>
                                    </div>
                                    <div className="modal-body scrollable-body">
                                        <section className="modal-section">
                                            <h3>Test Details</h3>
                                            <div className="form-group-flex">
                                                <div className="form-field">
                                                    <label>Test Title</label>
                                                    <input type="text" placeholder="e.g. JavaScript Proficiency Test"
                                                        value={newTest.title} onChange={e => setNewTest({ ...newTest, title: e.target.value })} />
                                                </div>
                                                <div className="form-field">
                                                    <label>Linked Job Posting</label>
                                                    <select value={newTest.jobId} onChange={e => setNewTest({ ...newTest, jobId: e.target.value })}>
                                                        <option value="">Select Job</option>
                                                        {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group-flex">
                                                <div className="form-field">
                                                    <label>Schedule Date</label>
                                                    <input type="date" value={newTest.scheduledDate} onChange={e => setNewTest({ ...newTest, scheduledDate: e.target.value })} />
                                                </div>
                                                <div className="form-field">
                                                    <label>Start Time</label>
                                                    <input type="time" value={newTest.startTime} onChange={e => setNewTest({ ...newTest, startTime: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="form-group-flex">
                                                <div className="form-field">
                                                    <label>Duration (Minutes)</label>
                                                    <input type="number" placeholder="60" value={newTest.durationMinutes} onChange={e => setNewTest({ ...newTest, durationMinutes: e.target.value })} />
                                                </div>
                                                <div className="form-field">
                                                    <label>Passing Score (%)</label>
                                                    <input type="number" placeholder="70" value={newTest.passingScore} onChange={e => setNewTest({ ...newTest, passingScore: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="form-field">
                                                <label>Test Description</label>
                                                <textarea placeholder="Briefly describe what this test evaluates..." value={newTest.description} onChange={e => setNewTest({ ...newTest, description: e.target.value })}></textarea>
                                            </div>
                                        </section>

                                        <section className="modal-section">
                                            <div className="section-header-row">
                                                <h3>Questions & Answers</h3>
                                                <button className="btn-add-question" onClick={addQuestion}><FaPlus /> Add Question</button>
                                            </div>

                                            {newTest.questions.map((q, qIndex) => (
                                                <div key={qIndex} className="question-builder-card">
                                                    <div className="qb-header">
                                                        <span>Question {qIndex + 1}</span>
                                                        <button className="text-danger" onClick={() => removeQuestion(qIndex)}>&times;</button>
                                                    </div>
                                                    <div className="form-field">
                                                        <input type="text" placeholder="Enter question text..." value={q.questionText} onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)} />
                                                    </div>
                                                    <div className="form-field">
                                                        <label>Points</label>
                                                        <input type="number" style={{ width: '80px' }} value={q.points} onChange={(e) => updateQuestion(qIndex, 'points', e.target.value)} />
                                                    </div>

                                                    <div className="qb-options">
                                                        <label>Options (Check correct answer)</label>
                                                        {q.options.map((opt, oIndex) => (
                                                            <div key={oIndex} className="option-row">
                                                                <input type="radio" name={`correct-${qIndex}`} checked={opt.isCorrect} onChange={() => setCorrectOption(qIndex, oIndex)} />
                                                                <input type="text" placeholder={`Option ${oIndex + 1}`} value={opt.optionText} onChange={(e) => updateOption(qIndex, oIndex, 'optionText', e.target.value)} />
                                                            </div>
                                                        ))}
                                                        <button className="btn-link-sm" onClick={() => addOption(qIndex)}>+ Add Option</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </section>
                                    </div>
                                    <div className="modal-footer">
                                        <button className="cancel-btn" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                        <button className="schedule-btn-premium" onClick={handleCreateTest}>Create & Schedule Test</button>
                                    </div>
                                </div>
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

export default MockTests;
