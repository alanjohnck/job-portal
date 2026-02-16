import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import { FaWallet, FaUsers, FaBuilding, FaBriefcase, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { getAdminDashboardStats, getAdminRecentActivity } from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsData, activityData] = await Promise.all([
                getAdminDashboardStats(),
                getAdminRecentActivity(10)
            ]);
            setStats(statsData);
            setRecentActivity(activityData);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const formatNumber = (value) => {
        return new Intl.NumberFormat('en-US').format(value);
    };

    const getStatIcon = (label) => {
        switch (label.toLowerCase()) {
            case 'total revenue': return <FaWallet />;
            case 'total users': return <FaUsers />;
            case 'companies': return <FaBuilding />;
            case 'total jobs': return <FaBriefcase />;
            default: return <FaBriefcase />;
        }
    };

    const getStatColor = (label) => {
        switch (label.toLowerCase()) {
            case 'total revenue': return '#7c3aed';
            case 'total users': return '#3b82f6';
            case 'companies': return '#10b981';
            case 'total jobs': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    const getActivityType = (action) => {
        if (action.includes('Joined')) return 'user';
        if (action.includes('Posted') || action.includes('job')) return 'company';
        if (action.includes('ticket') || action.includes('Raised')) return 'support';
        if (action.includes('Renewed') || action.includes('payment')) return 'payment';
        return 'user';
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return `${seconds} seconds ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        const days = Math.floor(hours / 24);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    };

    if (loading) {
        return (
            <div className="admin-layout">
                <AdminSidebar />
                <main className="admin-main">
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <p>Loading dashboard...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-layout">
                <AdminSidebar />
                <main className="admin-main">
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
                        <p>Error loading dashboard: {error}</p>
                        <button onClick={fetchDashboardData} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
                            Retry
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    const statsArray = stats ? [
        {
            label: 'Total Revenue',
            value: formatCurrency(stats.totalRevenue || 0),
            icon: getStatIcon('Total Revenue'),
            growth: stats.revenueGrowth ? `${stats.revenueGrowth > 0 ? '+' : ''}${stats.revenueGrowth.toFixed(1)}%` : '0%',
            color: getStatColor('Total Revenue')
        },
        {
            label: 'Total Users',
            value: formatNumber(stats.totalUsers || 0),
            icon: getStatIcon('Total Users'),
            growth: stats.userGrowth ? `${stats.userGrowth > 0 ? '+' : ''}${stats.userGrowth.toFixed(1)}%` : '0%',
            color: getStatColor('Total Users')
        },
        {
            label: 'Companies',
            value: formatNumber(stats.totalCompanies || 0),
            icon: getStatIcon('Companies'),
            growth: stats.companyGrowth ? `${stats.companyGrowth > 0 ? '+' : ''}${stats.companyGrowth.toFixed(1)}%` : '0%',
            color: getStatColor('Companies')
        },
        {
            label: 'Total Jobs',
            value: formatNumber(stats.totalJobs || 0),
            icon: getStatIcon('Total Jobs'),
            growth: stats.jobGrowth ? `${stats.jobGrowth > 0 ? '+' : ''}${stats.jobGrowth.toFixed(1)}%` : '0%',
            color: getStatColor('Total Jobs')
        },
    ] : [];

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
                        <span>Admin</span>
                        <div className="admin-avatar">A</div>
                    </div>
                </header>

                <div className="admin-stats-grid">
                    {statsArray.map((stat, idx) => (
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
                            {recentActivity.length > 0 ? recentActivity.map((act, i) => (
                                <div key={i} className="activity-item">
                                    <div className={`activity-icon ${getActivityType(act.action)}`}></div>
                                    <div className="activity-info">
                                        <p><strong>{act.userName || act.companyName || 'Unknown'}</strong> {act.action}</p>
                                        <span>{formatTimeAgo(act.timestamp)}</span>
                                    </div>
                                </div>
                            )) : (
                                <p style={{ textAlign: 'center', color: '#6b7280', padding: '1rem' }}>No recent activity</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
