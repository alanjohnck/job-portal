import React, { useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import { FaSearch, FaEllipsisV, FaUserSlash, FaUserCheck, FaInfoCircle } from 'react-icons/fa';
import './AdminUsers.css';

const AdminUsers = () => {
    const [users, setUsers] = useState([
        { id: 1, name: 'Guy Hawkins', email: 'guy.h@example.com', role: 'Candidate', joined: 'Mar 12, 2024', status: 'Active' },
        { id: 2, name: 'Jacob Jones', email: 'jjones@brand.com', role: 'Candidate', joined: 'Mar 10, 2024', status: 'Active' },
        { id: 3, name: 'Cameron Williamson', email: 'cam@will.com', role: 'Candidate', joined: 'Mar 08, 2024', status: 'Deactivated' },
        { id: 4, name: 'Robert Fox', email: 'robert.fox@dev.com', role: 'Candidate', joined: 'Mar 05, 2024', status: 'Active' },
        { id: 5, name: 'Kathryn Murphy', email: 'kathryn@ui.com', role: 'Candidate', joined: 'Mar 02, 2024', status: 'Active' },
    ]);

    const toggleStatus = (id) => {
        setUsers(users.map(u =>
            u.id === id ? { ...u, status: u.status === 'Active' ? 'Deactivated' : 'Active' } : u
        ));
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <main className="admin-main">
                <div className="admin-page-header">
                    <div className="header-left">
                        <h1>User Management</h1>
                        <p>Total {users.length} registered candidates in the system.</p>
                    </div>
                    <div className="header-search">
                        <FaSearch className="search-icon" />
                        <input type="text" placeholder="Search by name or email..." />
                    </div>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Candidate Name</th>
                                <th>Email Address</th>
                                <th>Role</th>
                                <th>Joined Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} className={u.status === 'Deactivated' ? 'row-disabled' : ''}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar-text">{u.name.charAt(0)}</div>
                                            <span className="user-name">{u.name}</span>
                                        </div>
                                    </td>
                                    <td><span className="email-text">{u.email}</span></td>
                                    <td><span className="role-tag">{u.role}</span></td>
                                    <td><span className="date-text">{u.joined}</span></td>
                                    <td>
                                        <div className={`status-pill-admin ${u.status.toLowerCase()}`}>
                                            {u.status}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons-flex">
                                            <button className="icon-btn info" title="View Profile"><FaInfoCircle /></button>
                                            <button
                                                className={`icon-btn ${u.status === 'Active' ? 'deactivate' : 'activate'}`}
                                                onClick={() => toggleStatus(u.id)}
                                                title={u.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
                                            >
                                                {u.status === 'Active' ? <FaUserSlash /> : <FaUserCheck />}
                                            </button>
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

export default AdminUsers;
