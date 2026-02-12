import React, { useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import { FaSearch, FaBuilding, FaBan, FaCheckCircle, FaExternalLinkAlt } from 'react-icons/fa';
import './AdminCompanies.css';

const AdminCompanies = () => {
    const [companies, setCompanies] = useState([
        { id: 1, name: 'Google', industry: 'Technology', location: 'Mountain View, CA', status: 'Active', rev: '$12,400' },
        { id: 2, name: 'Microsoft', industry: 'Software', location: 'Redmond, WA', status: 'Active', rev: '$8,200' },
        { id: 3, name: 'Netflix', industry: 'Entertainment', location: 'Los Gatos, CA', status: 'Deactivated', rev: '$5,100' },
        { id: 4, name: 'Meta', industry: 'Social Media', location: 'Menlo Park, CA', status: 'Active', rev: '$4,800' },
        { id: 5, name: 'Amazon', industry: 'E-commerce', location: 'Seattle, WA', status: 'Active', rev: '$15,900' },
    ]);

    const toggleStatus = (id) => {
        setCompanies(companies.map(c =>
            c.id === id ? { ...c, status: c.status === 'Active' ? 'Deactivated' : 'Active' } : c
        ));
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <main className="admin-main">
                <div className="admin-page-header">
                    <div className="header-left">
                        <h1>Company Management</h1>
                        <p>Managing {companies.length} business partners in the ecosystem.</p>
                    </div>
                    <div className="header-search">
                        <FaSearch className="search-icon" />
                        <input type="text" placeholder="Search by name or industry..." />
                    </div>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Industry</th>
                                <th>Location</th>
                                <th>Revenue generated</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.map((c) => (
                                <tr key={c.id} className={c.status === 'Deactivated' ? 'row-disabled' : ''}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="company-logo-admin">{c.name.charAt(0)}</div>
                                            <div className="company-info-cell">
                                                <span className="user-name">{c.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="industry-text">{c.industry}</span></td>
                                    <td><span className="date-text">{c.location}</span></td>
                                    <td><span className="rev-text">{c.rev}</span></td>
                                    <td>
                                        <div className={`status-pill-admin ${c.status.toLowerCase()}`}>
                                            {c.status}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons-flex">
                                            <button className="icon-btn info" title="Visit Profile"><FaExternalLinkAlt /></button>
                                            <button
                                                className={`icon-btn ${c.status === 'Active' ? 'deactivate' : 'activate'}`}
                                                onClick={() => toggleStatus(c.id)}
                                                title={c.status === 'Active' ? 'Deactivate Company' : 'Activate Company'}
                                            >
                                                {c.status === 'Active' ? <FaBan /> : <FaCheckCircle />}
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

export default AdminCompanies;
