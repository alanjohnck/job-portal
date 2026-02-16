import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import { FaHeadset, FaSearch, FaCommentDots, FaClock, FaCheckCircle, FaUser, FaBuilding } from 'react-icons/fa';
import { getAdminSupportTickets, updateTicketStatus } from '../../services/api';
import './AdminSupport.css';

const AdminSupport = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [stats, setStats] = useState({ open: 0, inProgress: 0, closed: 0 });

    useEffect(() => {
        fetchTickets();
    }, [statusFilter, priorityFilter]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const data = await getAdminSupportTickets(statusFilter, priorityFilter, '', 1, 50);
            const ticketList = data.items || data || [];
            setTickets(ticketList);

            // Calculate stats
            const open = ticketList.filter(t => t.status === 'Open').length;
            const inProgress = ticketList.filter(t => t.status === 'In Progress' || t.status === 'InProgress').length;
            const closed = ticketList.filter(t => t.status === 'Closed' || t.status === 'Resolved').length;
            setStats({ open, inProgress, closed });

            setError(null);
        } catch (err) {
            console.error('Failed to fetch support tickets:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (ticketId, newStatus) => {
        try {
            await updateTicketStatus(ticketId, newStatus);
            fetchTickets();
        } catch (err) {
            console.error('Failed to update ticket status:', err);
            alert('Failed to update ticket status: ' + err.message);
        }
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        const days = Math.floor(seconds / 86400);
        if (days === 1) return '1 day ago';
        return `${days} days ago`;
    };

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
                    <div className="s-stat open"><h4>{stats.open}</h4> <span>Unresolved</span></div>
                    <div className="s-stat progress"><h4>{stats.inProgress}</h4> <span>In Progress</span></div>
                    <div className="s-stat closed"><h4>{stats.closed}</h4> <span>Resolved</span></div>
                </div>

                <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #e5e7eb' }}
                    >
                        <option value="">All Status</option>
                        <option value="Open">Open</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Closed">Closed</option>
                    </select>
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #e5e7eb' }}
                    >
                        <option value="">All Priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <p>Loading support tickets...</p>
                    </div>
                ) : error ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
                        <p>Error loading tickets: {error}</p>
                        <button onClick={fetchTickets} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
                            Retry
                        </button>
                    </div>
                ) : (
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
                                {tickets.length > 0 ? tickets.map((t) => (
                                    <tr key={t.id}>
                                        <td><span className="ticket-id">#{t.ticketNumber || t.id.substring(0, 8)}</span></td>
                                        <td>
                                            <div className="support-from-cell">
                                                {t.userType === 'Candidate' || t.type === 'Candidate' ? <FaUser size={12} /> : <FaBuilding size={12} />}
                                                <div className="from-info">
                                                    <span className="from-name">{t.userName || t.from || 'Unknown'}</span>
                                                    <span className="from-type">{t.userType || t.type || 'User'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="subject-text">{t.subject}</span></td>
                                        <td>
                                            <div className={`priority-tag ${(t.priority || 'medium').toLowerCase()}`}>
                                                {t.priority || 'Medium'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={`status-pill-admin ${(t.status || 'open').replace(' ', '-').toLowerCase()}`}>
                                                {t.status || 'Open'}
                                            </div>
                                        </td>
                                        <td><span className="date-text">{formatTimeAgo(t.updatedAt || t.createdAt)}</span></td>
                                        <td>
                                            <div className="action-buttons-flex">
                                                <button className="icon-btn info" title="Chat/Reply"><FaCommentDots /></button>
                                                {t.status !== 'Closed' && t.status !== 'Resolved' && (
                                                    <button
                                                        className="icon-btn activate"
                                                        title="Mark Resolved"
                                                        onClick={() => handleUpdateStatus(t.id, 'Closed')}
                                                    >
                                                        <FaCheckCircle />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                            No support tickets found
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

export default AdminSupport;
