import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import './CustomerSupport.css';
import { FaTicketAlt, FaPlus, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { createSupportTicket, getMySupportTickets } from '../../services/api';

const CustomerSupport = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        priority: 'Medium',
        type: 'General'
    });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const data = await getMySupportTickets();
            setTickets(data.items || data || []);
        } catch (err) {
            console.error('Failed to fetch tickets:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitLoading(true);
            await createSupportTicket(formData);
            setSuccessMessage('Support ticket created successfully!');
            setFormData({ subject: '', description: '', priority: 'Medium', type: 'General' });
            setShowCreateForm(false);
            fetchTickets();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            alert('Failed to create ticket: ' + err.message);
        } finally {
            setSubmitLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Open': return <FaClock className="status-icon open" />;
            case 'InProgress': return <FaClock className="status-icon progress" />;
            case 'Closed': return <FaCheckCircle className="status-icon closed" />;
            case 'Resolved': return <FaCheckCircle className="status-icon closed" />;
            default: return <FaClock className="status-icon open" />;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="support-page">
            <Header />
            <div className="container support-container">
                <div className="support-header">
                    <div>
                        <h1>Customer Support</h1>
                        <p>Create and manage your support tickets</p>
                    </div>
                    <button
                        className="create-ticket-btn"
                        onClick={() => setShowCreateForm(!showCreateForm)}
                    >
                        <FaPlus /> New Ticket
                    </button>
                </div>

                {successMessage && (
                    <div className="success-message">
                        <FaCheckCircle /> {successMessage}
                    </div>
                )}

                {showCreateForm && (
                    <div className="ticket-form-card">
                        <h2>Create Support Ticket</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Subject *</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    placeholder="Brief description of your issue"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Priority</label>
                                    <select name="priority" value={formData.priority} onChange={handleInputChange}>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Type</label>
                                    <select name="type" value={formData.type} onChange={handleInputChange}>
                                        <option value="General">General</option>
                                        <option value="Technical">Technical</option>
                                        <option value="Billing">Billing</option>
                                        <option value="Account">Account</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Provide detailed information about your issue"
                                    rows="5"
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowCreateForm(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit" disabled={submitLoading}>
                                    {submitLoading ? 'Creating...' : 'Create Ticket'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="tickets-section">
                    <h2>My Support Tickets</h2>
                    {loading ? (
                        <div className="loading-state">Loading tickets...</div>
                    ) : tickets.length > 0 ? (
                        <div className="tickets-list">
                            {tickets.map((ticket) => (
                                <div key={ticket.id} className="ticket-card">
                                    <div className="ticket-header">
                                        <div className="ticket-title">
                                            <FaTicketAlt className="ticket-icon" />
                                            <div>
                                                <h3>{ticket.subject}</h3>
                                                <span className="ticket-id">#{ticket.ticketNumber || ticket.id.substring(0, 8)}</span>
                                            </div>
                                        </div>
                                        <div className="ticket-status">
                                            {getStatusIcon(ticket.status)}
                                            <span className={`status-badge ${(ticket.status || 'open').toLowerCase()}`}>
                                                {ticket.status || 'Open'}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="ticket-description">{ticket.description}</p>
                                    <div className="ticket-footer">
                                        <span className={`priority-badge ${(ticket.priority || 'medium').toLowerCase()}`}>
                                            {ticket.priority || 'Medium'} Priority
                                        </span>
                                        <span className="ticket-type">{ticket.type || 'General'}</span>
                                        <span className="ticket-date">Created: {formatDate(ticket.createdAt)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <FaTicketAlt className="empty-icon" />
                            <h3>No support tickets yet</h3>
                            <p>Create your first support ticket to get help from our team</p>
                            <button className="create-ticket-btn" onClick={() => setShowCreateForm(true)}>
                                <FaPlus /> Create Ticket
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerSupport;
