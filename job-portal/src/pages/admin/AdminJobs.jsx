import React, { useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import { FaSearch, FaBriefcase, FaBuilding, FaTrashAlt, FaEye } from 'react-icons/fa';
import './AdminJobs.css';

const AdminJobs = () => {
    const [jobs] = useState([
        { id: 1, title: 'Senior UI/UX Designer', company: 'Nalashaa Solutions', type: 'Full Time', salary: '$50k-$80k', applicants: 124, posted: '2 days ago' },
        { id: 2, title: 'Backend Software Engineer', company: 'Google', type: 'Remote', salary: '$120k-$150k', applicants: 450, posted: '5 hours ago' },
        { id: 3, title: 'Marketing Manager', company: 'Meta', type: 'Full Time', salary: '$90k-$110k', applicants: 89, posted: '1 day ago' },
        { id: 4, title: 'Visual Designer', company: 'Microsoft', type: 'Contract', salary: '$40/hr', applicants: 56, posted: '4 days ago' },
    ]);

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <main className="admin-main">
                <div className="admin-page-header">
                    <div className="header-left">
                        <h1>Platform Job Postings</h1>
                        <p>Currently {jobs.length} active job listings across the platform.</p>
                    </div>
                    <div className="header-search">
                        <FaSearch className="search-icon" />
                        <input type="text" placeholder="Search by job title or company..." />
                    </div>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Job Title</th>
                                <th>Company</th>
                                <th>Employment Type</th>
                                <th>Salary Range</th>
                                <th>Applicants</th>
                                <th>Posted Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map((j) => (
                                <tr key={j.id}>
                                    <td>
                                        <div className="job-title-cell">
                                            <FaBriefcase className="job-icon-admin" />
                                            <span className="user-name">{j.title}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="company-info-small">
                                            <FaBuilding size={12} />
                                            <span>{j.company}</span>
                                        </div>
                                    </td>
                                    <td><span className="type-tag">{j.type}</span></td>
                                    <td><span className="salary-text">{j.salary}</span></td>
                                    <td><span className="count-pill">{j.applicants}</span></td>
                                    <td><span className="date-text">{j.posted}</span></td>
                                    <td>
                                        <div className="action-buttons-flex">
                                            <button className="icon-btn info" title="View Job Details"><FaEye /></button>
                                            <button className="icon-btn deactivate" title="Remove Listing"><FaTrashAlt /></button>
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

export default AdminJobs;
