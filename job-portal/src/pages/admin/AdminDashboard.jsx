import React from 'react';
import AdminSidebar from './components/AdminSidebar';
import { FaWallet, FaUsers, FaBuilding, FaBriefcase, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const stats = [
        { label: 'Total Revenue', value: '$128,430', icon: <FaWallet />, growth: '+12.5%', color: '#7c3aed' },
        { label: 'Total Users', value: '14,200', icon: <FaUsers />, growth: '+5.2%', color: '#3b82f6' },
        { label: 'Companies', value: '840', icon: <FaBuilding />, growth: '+2.1%', color: '#10b981' },
        { label: 'Total Jobs', value: '3,240', icon: <FaBriefcase />, growth: '-1.4%', color: '#f59e0b' },
    ];

    const recentActivity = [
        { type: 'user', name: 'Devon Lane', action: 'Joined as Candidate', time: '2 mins ago' },
        { type: 'company', name: 'Nalashaa Solutions', action: 'Posted a new job', time: '15 mins ago' },
        { type: 'support', name: 'Guy Hawkins', action: 'Raised a ticket', time: '1 hour ago' },
        { type: 'payment', name: 'Microsoft', action: 'Renewed Platinum Plan', time: '3 hours ago' },
    ];

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <main className="admin-main">
                <header className="admin-header">
                    <div className="header-info">
                        <h1>System Overview</h1>
                        <p>Welcome back, Administrator. Here's what's happening today.</p>
                    </div>
                    <div className="admin-profile-quick">
                        <span>John Admin</span>
                        <div className="admin-avatar">A</div>
                    </div>
                </header>

                <div className="admin-stats-grid">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="admin-stat-card">
                            <div className="stat-icon-wrap" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                                {stat.icon}
                            </div>
                            <div className="stat-data">
                                <span className="stat-label">{stat.label}</span>
                                <div className="stat-value-group">
                                    <h3>{stat.value}</h3>
                                    <span className={`growth-tag ${stat.growth.startsWith('+') ? 'up' : 'down'}`}>
                                        {stat.growth.startsWith('+') ? <FaArrowUp /> : <FaArrowDown />}
                                        {stat.growth}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="admin-content-split">
                    <div className="revenue-chart-placeholder">
                        <div className="section-header">
                            <h3>Revenue Analytics</h3>
                            <select className="period-select">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                                <option>This Year</option>
                            </select>
                        </div>
                        <div className="chart-canvas">
                            {/* In a real app, use Chart.js or Recharts */}
                            <div className="bar-group">
                                {[60, 45, 80, 55, 90, 70, 85].map((h, i) => (
                                    <div key={i} className="bar" style={{ height: `${h}%` }}></div>
                                ))}
                            </div>
                            <div className="chart-labels">
                                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                            </div>
                        </div>
                    </div>

                    <div className="recent-activity-box">
                        <div className="section-header">
                            <h3>Recent Activity</h3>
                        </div>
                        <div className="activity-list">
                            {recentActivity.map((act, i) => (
                                <div key={i} className="activity-item">
                                    <div className={`activity-icon ${act.type}`}></div>
                                    <div className="activity-info">
                                        <p><strong>{act.name}</strong> {act.action}</p>
                                        <span>{act.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
