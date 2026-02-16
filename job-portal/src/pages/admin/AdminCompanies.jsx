import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import { FaSearch, FaBuilding, FaBan, FaCheckCircle, FaExternalLinkAlt } from 'react-icons/fa';
import { getAdminUsers, toggleUserStatus } from '../../services/api';
import './AdminCompanies.css';

const AdminCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            // Fetch only company role users
            const data = await getAdminUsers('Company', '', searchTerm);
            setCompanies(data.items || data || []);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch companies:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCompanies();
    };

    const handleToggleStatus = async (companyId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'Active';
            await toggleUserStatus(companyId, !newStatus);
            fetchCompanies();
        } catch (err) {
            console.error('Failed to toggle company status:', err);
            alert('Failed to update company status: ' + err.message);
        }
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
                    <form onSubmit={handleSearch} className="header-search">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name or industry..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                </div>

                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <p>Loading companies...</p>
                    </div>
                ) : error ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
                        <p>Error loading companies: {error}</p>
                        <button onClick={fetchCompanies} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Company</th>
                                    <th>Industry</th>
                                    <th>Location</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {companies.length > 0 ? companies.map((c) => (
                                    <tr key={c.id} className={c.isActive === false ? 'row-disabled' : ''}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="company-logo-admin">
                                                    {(c.companyName || c.fullName || c.email || 'C').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="company-info-cell">
                                                    <span className="user-name">{c.companyName || c.fullName || 'Unknown'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="industry-text">{c.industry || 'N/A'}</span></td>
                                        <td><span className="date-text">{c.location || 'N/A'}</span></td>
                                        <td><span className="email-text">{c.email}</span></td>
                                        <td>
                                            <div className={`status-pill-admin ${c.isActive ? 'active' : 'deactivated'}`}>
                                                {c.isActive ? 'Active' : 'Deactivated'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-buttons-flex">
                                                <button className="icon-btn info" title="Visit Profile"><FaExternalLinkAlt /></button>
                                                <button
                                                    className={`icon-btn ${c.isActive ? 'deactivate' : 'activate'}`}
                                                    onClick={() => handleToggleStatus(c.id, c.isActive ? 'Active' : 'Deactivated')}
                                                    title={c.isActive ? 'Deactivate Company' : 'Activate Company'}
                                                >
                                                    {c.isActive ? <FaBan /> : <FaCheckCircle />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                            No companies found
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

export default AdminCompanies;
