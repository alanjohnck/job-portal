import React from 'react';
import CompanyNavbar from './components/CompanyNavbar';
import CompanySidebar from './components/CompanySidebar';
import { FaBriefcase, FaUserCheck, FaChevronRight, FaEllipsisV, FaCheckCircle, FaUsers, FaArrowRight } from 'react-icons/fa';
import './CompanyDashboard.css';

const CompanyDashboard = () => {
    const stats = [
        { label: 'Open Jobs', value: '589', icon: <FaBriefcase />, color: '#0066ff', bg: '#f0f7ff' },
        { label: 'Saved Candidates', value: '2,517', icon: <FaUserCheck />, color: '#ffa500', bg: '#fff7ed' }
    ];

    const recentJobs = [
        { title: 'UI/UX Designer', type: 'Full Time', remaining: '27 days remaining', status: 'Active', applications: 798 },
        { title: 'Senior UX Designer', type: 'Internship', remaining: '8 days remaining', status: 'Active', applications: 185 },
        { title: 'Technical Support Specialist', type: 'Part Time', remaining: '4 days remaining', status: 'Active', applications: 556 },
        { title: 'Junior Graphic Designer', type: 'Full Time', remaining: '24 days remaining', status: 'Active', applications: 583 },
        { title: 'Front End Developer', type: 'Full Time', date: 'Dec 7, 2019', status: 'Expire', applications: 740 }
    ];

    return (
        <div className="comp-layout">
            <CompanyNavbar />
            <div className="comp-container">
                <div className="container comp-flex">
                    <CompanySidebar />

                    <main className="comp-main-content">
                        <section className="overview-section">
                            <div className="welcome-box">
                                <h1>Hello, Instagram</h1>
                                <p>Here is your daily activities and applications</p>
                            </div>

                            <div className="stats-grid">
                                {stats.map((stat, idx) => (
                                    <div key={idx} className="stat-card-premium" style={{ borderLeft: `4px solid ${stat.color}` }}>
                                        <div className="stat-content">
                                            <span className="stat-value">{stat.value}</span>
                                            <span className="stat-label">{stat.label}</span>
                                        </div>
                                        <div className="stat-icon-box" style={{ background: stat.bg, color: stat.color }}>
                                            {stat.icon}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="jobs-table-section">
                                <div className="section-header-flex">
                                    <h3>Recently Posted Jobs</h3>
                                    <button className="view-all-link">View all <FaArrowRight /></button>
                                </div>

                                <div className="premium-table-container">
                                    <table className="jobs-table">
                                        <thead>
                                            <tr>
                                                <th>JOBS</th>
                                                <th>STATUS</th>
                                                <th>APPLICATIONS</th>
                                                <th>ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentJobs.map((job, idx) => (
                                                <tr key={idx} className={job.status === 'Active' ? 'active-row' : 'expired-row'}>
                                                    <td>
                                                        <div className="job-info-cell">
                                                            <span className="job-name">{job.title}</span>
                                                            <span className="job-meta">
                                                                {job.type} • {job.remaining || job.date}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`status-pill ${job.status.toLowerCase()}`}>
                                                            {job.status === 'Active' ? <FaCheckCircle /> : <FaEllipsisV />} {job.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="apps-cell">
                                                            <FaUsers /> {job.applications} Applications
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="actions-cell">
                                                            <button className="view-apps-btn">View Applications</button>
                                                            <button className="more-btn"><FaEllipsisV /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>

            <footer className="comp-footer">
                <div className="container">
                    <p>© 2021 Jobpilot - Job Board. All rights Reserved</p>
                </div>
            </footer>
        </div>
    );
};

export default CompanyDashboard;
