import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    FaChartLine,
    FaUsers,
    FaBuilding,
    FaBriefcase,
    FaHeadset,
    FaSignOutAlt,
    FaShieldAlt
} from 'react-icons/fa';
import './AdminSidebar.css';

const AdminSidebar = () => {
    const navItems = [
        { label: 'Dashboard', icon: <FaChartLine />, path: '/admin/dashboard' },
        { label: 'Manage Users', icon: <FaUsers />, path: '/admin/users' },
        { label: 'Manage Companies', icon: <FaBuilding />, path: '/admin/companies' },
        { label: 'Job Postings', icon: <FaBriefcase />, path: '/admin/jobs' },
        { label: 'Support Tickets', icon: <FaHeadset />, path: '/admin/support' },
    ];

    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar-header">
                <div className="admin-badge">
                    <FaShieldAlt /> <span>Admin Portal</span>
                </div>
            </div>

            <div className="sidebar-group">
                <nav className="sidebar-nav">
                    {navItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        >
                            <span className="icon">{item.icon}</span>
                            <span className="label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="sidebar-footer">
                <button className="logout-link">
                    <FaSignOutAlt className="icon" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
