import React, { useState } from 'react';
import CompanyNavbar from './components/CompanyNavbar';
import CompanySidebar from './components/CompanySidebar';
import { FaPlus, FaCalendarAlt, FaClock, FaCheckCircle, FaUserGraduate, FaChevronRight, FaTrophy, FaEllipsisV } from 'react-icons/fa';
import './MockTests.css';

const MockTests = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'results'
    const [selectedTest, setSelectedTest] = useState(null);

    const [mockTests, setMockTests] = useState([
        {
            id: 1,
            title: 'Frontend Technical Assessment',
            job: 'Senior UI/UX Designer',
            date: '2024-03-25',
            time: '10:00 AM',
            duration: '60 mins',
            status: 'Scheduled',
            applicants: 45
        },
        {
            id: 2,
            title: 'Backend Logic Challenge',
            job: 'Senior Software Engineer',
            date: '2024-03-20',
            time: '02:00 PM',
            duration: '90 mins',
            status: 'Finished',
            applicants: 32
        },
        {
            id: 3,
            title: 'Design Principles Quiz',
            job: 'Junior Graphic Designer',
            date: '2024-03-15',
            time: '11:00 AM',
            duration: '45 mins',
            status: 'Finished',
            applicants: 28
        }
    ]);

    const [topCandidates] = useState([
        { id: 1, name: 'Guy Hawkins', score: '98/100', rank: 1, image: 'https://i.pravatar.cc/150?u=Guy+Hawkins' },
        { id: 2, name: 'Jacob Jones', score: '95/100', rank: 2, image: 'https://i.pravatar.cc/150?u=Jacob+Jones' },
        { id: 3, name: 'Cameron Williamson', score: '92/100', rank: 3, image: 'https://i.pravatar.cc/150?u=Cameron+Williamson' },
        { id: 4, name: 'Robert Fox', score: '88/100', rank: 4, image: 'https://i.pravatar.cc/150?u=Robert+Fox' },
        { id: 5, name: 'Kathryn Murphy', score: '85/100', rank: 5, image: 'https://i.pravatar.cc/150?u=Kathryn+Murphy' },
    ]);

    const handleViewResults = (test) => {
        setSelectedTest(test);
        setViewMode('results');
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
                                                <button className="dots-btn-small"><FaEllipsisV /></button>
                                            </div>
                                            <div className="test-card-body">
                                                <h3>{test.title}</h3>
                                                <p className="job-linked">Linked to: <strong>{test.job}</strong></p>

                                                <div className="test-meta-grid">
                                                    <div className="meta-item">
                                                        <FaCalendarAlt /> <span>{test.date}</span>
                                                    </div>
                                                    <div className="meta-item">
                                                        <FaClock /> <span>{test.time} ({test.duration})</span>
                                                    </div>
                                                    <div className="meta-item">
                                                        <FaCheckCircle /> <span>{test.applicants} Applicants</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="test-card-footer">
                                                {test.status === 'Finished' ? (
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
                                        <p>{selectedTest?.title} - {selectedTest?.job}</p>
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
                                <div className="test-modal-content">
                                    <div className="modal-header">
                                        <h2>Create Technical Assessment</h2>
                                        <button className="close-modal" onClick={() => setShowCreateModal(false)}>&times;</button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-group-flex">
                                            <div className="form-field">
                                                <label>Test Title</label>
                                                <input type="text" placeholder="e.g. JavaScript Proficiency Test" />
                                            </div>
                                            <div className="form-field">
                                                <label>Linked Job Posting</label>
                                                <select>
                                                    <option>Senior UI/UX Designer</option>
                                                    <option>Senior Software Engineer</option>
                                                    <option>Marketing Manager</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group-flex">
                                            <div className="form-field">
                                                <label>Schedule Date</label>
                                                <input type="date" />
                                            </div>
                                            <div className="form-field">
                                                <label>Start Time</label>
                                                <input type="time" />
                                            </div>
                                        </div>
                                        <div className="form-group-flex">
                                            <div className="form-field">
                                                <label>Duration (Minutes)</label>
                                                <input type="number" placeholder="60" />
                                            </div>
                                            <div className="form-field">
                                                <label>Passing Score (%)</label>
                                                <input type="number" placeholder="70" />
                                            </div>
                                        </div>
                                        <div className="form-field">
                                            <label>Test Description</label>
                                            <textarea placeholder="Briefly describe what this test evaluates..."></textarea>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button className="cancel-btn" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                        <button className="schedule-btn-premium">Create & Schedule Test</button>
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
