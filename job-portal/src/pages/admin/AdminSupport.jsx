import React, { useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import { FaHeadset, FaSearch, FaCommentDots, FaClock, FaCheckCircle, FaUser, FaBuilding } from 'react-icons/fa';
import './AdminSupport.css';

const AdminSupport = () => {
    const [tickets] = useState([
        { id: 'T-842', from: 'Guy Hawkins', type: 'Candidate', subject: 'Login Issue', priority: 'High', status: 'Open', time: '20 mins ago' },
        { id: 'T-841', from: 'Microsoft', type: 'Company', subject: 'Billing Query', priority: 'Medium', status: 'Closed', time: '2 hours ago' },
        { id: 'T-840', from: 'Jacob Jones', type: 'Candidate', subject: 'Resume Upload Error', priority: 'Low', status: 'Open', time: '5 hours ago' },
        { id: 'T-839', from: 'Google', type: 'Company', subject: 'API Integration', priority: 'High', status: 'In Progress', time: '1 day ago' },
    ]);

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <main className="admin-main">
                <div className="admin-page-header">
                    <div className="header-left">
                        <h1>Customer Support Center</h1>
                        <p>Managing support requests from both Candidates and Employers.</p>
                    </div>
                </div>

                <div className="support-stats">
                    <div className="s-stat open"><h4>12</h4> <span>Unresolved</span></div>
                    <div className="s-stat progress"><h4>5</h4> <span>In Progress</span></div>
                    <div className="s-stat closed"><h4>145</h4> <span>Resolved</span></div>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Ticket ID</th>
                                <th>From</th>
                                <th>Subject</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Last Active</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((t) => (
                                <tr key={t.id}>
                                    <td><span className="ticket-id">#{t.id}</span></td>
                                    <td>
                                        <div className="support-from-cell">
                                            {t.type === 'Candidate' ? <FaUser size={12} /> : <FaBuilding size={12} />}
                                            <div className="from-info">
                                                <span className="from-name">{t.from}</span>
                                                <span className="from-type">{t.type}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="subject-text">{t.subject}</span></td>
                                    <td>
                                        <div className={`priority-tag ${t.priority.toLowerCase()}`}>
                                            {t.priority}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={`status-pill-admin ${t.status.replace(' ', '-').toLowerCase()}`}>
                                            {t.status}
                                        </div>
                                    </td>
                                    <td><span className="date-text">{t.time}</span></td>
                                    <td>
                                        <div className="action-buttons-flex">
                                            <button className="icon-btn info" title="Chat/Reply"><FaCommentDots /></button>
                                            <button className="icon-btn activate" title="Mark Resolved"><FaCheckCircle /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminSupport;
