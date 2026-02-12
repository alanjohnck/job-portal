import React, { useState } from 'react';
import CompanyNavbar from './components/CompanyNavbar';
import CompanySidebar from './components/CompanySidebar';
import { FaEllipsisV, FaCheckCircle, FaTimesCircle, FaUsers, FaChevronLeft, FaChevronRight, FaPlusCircle, FaEye, FaBan } from 'react-icons/fa';
import './MyJobs.css';

const MyJobs = () => {
    const [jobs] = useState([
        { id: 1, title: 'UI/UX Designer', type: 'Full Time', remaining: '27 days remaining', status: 'Active', applications: 798 },
        { id: 2, title: 'Senior UX Designer', type: 'Internship', remaining: '8 days remaining', status: 'Active', applications: 185 },
        { id: 3, title: 'Junior Graphic Designer', type: 'Full Time', remaining: '24 days remaining', status: 'Active', applications: 583 },
        { id: 4, title: 'Front End Developer', type: 'Full Time', date: 'Dec 7, 2019', status: 'Expire', applications: 740 },
        { id: 5, title: 'Technical Support Specialist', type: 'Part Time', remaining: '4 days remaining', status: 'Active', applications: 556 },
        { id: 6, title: 'Interaction Designer', type: 'Contract Base', date: 'Feb 2, 2019', status: 'Expire', applications: 426 },
        { id: 7, title: 'Software Engineer', type: 'Temporary', remaining: '9 days remaining', status: 'Active', applications: 922 },
        { id: 8, title: 'Product Designer', type: 'Full Time', remaining: '7 days remaining', status: 'Active', applications: 994 },
        { id: 9, title: 'Project Manager', type: 'Full Time', date: 'Dec 4, 2019', status: 'Expire', applications: 196 },
        { id: 10, title: 'Marketing Manager', type: 'Full Time', remaining: '4 days remaining', status: 'Active', applications: 492 },
    ]);

    const [showMenu, setShowMenu] = useState(null);

    return (
        <div className="comp-layout">
            <CompanyNavbar />
            <div className="comp-container">
                <div className="container comp-flex">
                    <CompanySidebar />

                    <main className="comp-main-content">
                        <div className="my-jobs-header">
                            <div className="header-left">
                                <h1>My Jobs <span className="count-badge">(589)</span></h1>
                            </div>
                            <div className="header-right">
                                <label>Job status</label>
                                <select className="status-select">
                                    <option>All Jobs</option>
                                    <option>Active</option>
                                    <option>Expired</option>
                                </select>
                            </div>
                        </div>

                        <div className="premium-table-card">
                            <table className="jobs-data-table">
                                <thead>
                                    <tr>
                                        <th>JOBS</th>
                                        <th>STATUS</th>
                                        <th>APPLICATIONS</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map((job) => (
                                        <tr key={job.id} className={job.id === 5 ? 'highlighted-row' : ''}>
                                            <td>
                                                <div className="job-cell-info">
                                                    <span className="job-title-text">{job.title}</span>
                                                    <span className="job-sub-text">{job.type} • {job.remaining || job.date}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-tag ${job.status.toLowerCase()}`}>
                                                    {job.status === 'Active' ? <FaCheckCircle className="icon" /> : <FaTimesCircle className="icon" />}
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="apps-info">
                                                    <FaUsers className="icon" /> {job.applications} Applications
                                                </div>
                                            </td>
                                            <td>
                                                <div className="actions-cell-flex">
                                                    <button className="view-apps-btn-premium">View Applications</button>
                                                    <div className="more-menu-container">
                                                        <button
                                                            className="dots-btn"
                                                            onClick={() => setShowMenu(showMenu === job.id ? null : job.id)}
                                                        >
                                                            <FaEllipsisV />
                                                        </button>
                                                        {showMenu === job.id && (
                                                            <div className="dropdown-menu-premium">
                                                                <button><FaPlusCircle /> Promote Job</button>
                                                                <button><FaEye /> View Detail</button>
                                                                <button><FaBan /> Make it Expire</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="pagination-comp">
                            <button className="page-arrow"><FaChevronLeft /></button>
                            <button className="page-number active">01</button>
                            <button className="page-number">02</button>
                            <button className="page-number">03</button>
                            <button className="page-number">04</button>
                            <button className="page-number">05</button>
                            <button className="page-arrow"><FaChevronRight /></button>
                        </div>

                        <footer className="comp-footer-minimal">
                            <p>© 2021 Jobpilot - Job Board. All rights Reserved</p>
                        </footer>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MyJobs;
