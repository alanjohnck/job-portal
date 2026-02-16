import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import { FaSearch, FaEllipsisV, FaUserSlash, FaUserCheck, FaInfoCircle } from 'react-icons/fa';
import { getAdminUsers, toggleUserStatus } from '../../services/api';
import './AdminUsers.css';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [roleFilter, statusFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAdminUsers(roleFilter, statusFilter, searchTerm);
            console.log('Admin Users API Response:', data);
            console.log('Extracted items:', data.items || data || []);
            setUsers(data.items || data || []);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers();
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'Active';
            await toggleUserStatus(userId, !newStatus);
            // Refresh the user list
            fetchUsers();
        } catch (err) {
            console.error('Failed to toggle user status:', err);
            alert('Failed to update user status: ' + err.message);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <main className="admin-main">
                <div className="admin-page-header">
                    <div className="header-left">
                        <h1>User Management</h1>
                        <p>Total {users.length} registered users in the system.</p>
                    </div>
                    <form onSubmit={handleSearch} className="header-search">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                </div>

                <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #e5e7eb' }}
                    >
                        <option value="">All Roles</option>
                        <option value="Candidate">Candidate</option>
                        <option value="Company">Company</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #e5e7eb' }}
                    >
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Deactivated">Deactivated</option>
                    </select>
                </div>

                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <p>Loading users...</p>
                    </div>
                ) : error ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
                        <p>Error loading users: {error}</p>
                        <button onClick={fetchUsers} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>User Name</th>
                                    <th>Email Address</th>
                                    <th>Role</th>
                                    <th>Joined Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? users.map((u) => (
                                    <tr key={u.id} className={u.isActive === false ? 'row-disabled' : ''}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="user-avatar-text">
                                                    {(u.fullName || u.name || u.email || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <span className="user-name">{u.fullName || u.name || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td><span className="email-text">{u.email}</span></td>
                                        <td><span className="role-tag">{u.role}</span></td>
                                        <td><span className="date-text">{formatDate(u.createdAt || u.joinedDate)}</span></td>
                                        <td>
                                            <div className={`status-pill-admin ${u.isActive ? 'active' : 'deactivated'}`}>
                                                {u.isActive ? 'Active' : 'Deactivated'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-buttons-flex">
                                                <button className="icon-btn info" title="View Profile"><FaInfoCircle /></button>
                                                <button
                                                    className={`icon-btn ${u.isActive ? 'deactivate' : 'activate'}`}
                                                    onClick={() => handleToggleStatus(u.id, u.isActive ? 'Active' : 'Deactivated')}
                                                    title={u.isActive ? 'Deactivate Account' : 'Activate Account'}
                                                >
                                                    {u.isActive ? <FaUserSlash /> : <FaUserCheck />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                            No users found
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

export default AdminUsers;
