import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    FaChartBar,
    FaUserCircle,
    FaPlusCircle,
    FaBriefcase,
    FaBookmark,
    FaFileInvoice,
    FaBuilding,
    FaCog,
    FaSignOutAlt,
    FaClipboardList
} from 'react-icons/fa';
import './CompanySidebar.css';

const CompanySidebar = () => {
    const navItems = [
        { label: 'Overview', icon: <FaChartBar />, path: '/company/dashboard' },
        { label: 'Employers Profile', icon: <FaUserCircle />, path: '/company/setup' },
        { label: 'Post a Job', icon: <FaPlusCircle />, path: '/company/post-job' },
        { label: 'My Jobs', icon: <FaBriefcase />, path: '/company/my-jobs' },
        { label: 'Saved Candidate', icon: <FaBookmark />, path: '/company/saved-candidates' },
        { label: 'Mock Tests', icon: <FaClipboardList />, path: '/company/mock-tests' },
        { label: 'Settings', icon: <FaCog />, path: '/company/settings' },
    ];

    return (
        <aside className="comp-sidebar">
            <div className="sidebar-group">
                <p className="group-title">EMPLOYERS DASHBOARD</p>
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
                    <span>Log-out</span>
                </button>
            </div>
        </aside>
    );
};

export default CompanySidebar;
