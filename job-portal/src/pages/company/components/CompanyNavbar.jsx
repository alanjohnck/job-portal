import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBriefcase, FaPhoneAlt, FaBell, FaRegUserCircle, FaPlus } from 'react-icons/fa';
import './CompanyNavbar.css';
import './CompanyLayout.css';

const CompanyNavbar = () => {
    const location = useLocation();

    return (
        <header className="comp-navbar">
            <div className="comp-nav-top">
                <div className="container comp-nav-flex">
                    <div className="nav-top-left">
                        <Link to="/">Home</Link>
                        <Link to="/company/find-candidate">Find Candidate</Link>
                        <Link to="/company/dashboard" className="active">Dashboard</Link>
                        <Link to="/company/my-jobs">My Jobs</Link>
                        {/* <Link to="/company/applications">Applications</Link> */}
                        <Link to="/company/support">Customer Supports</Link>
                    </div>
                    <div className="nav-top-right">
                        <span className="nav-item"><FaPhoneAlt size={12} /> +1-202-555-0178</span>
                        <div className="nav-divider"></div>
                        <span className="nav-item">🇺🇸 English</span>
                    </div>
                </div>
            </div>

            <div className="comp-nav-main">
                <div className="container comp-nav-flex">
                    <div className="nav-main-left">
                        <Link to="/" className="comp-logo">
                            <div className="logo-box"><FaBriefcase /></div>
                        </Link>
                    </div>
                    <div className="nav-main-right">
                        <div className="nav-actions">
                            <button className="notif-btn">
                                <FaBell />
                                <span className="badge"></span>
                            </button>
                            <Link to="/company/post-job" className="post-job-btn">
                                Post A Jobs
                            </Link>
                            <div className="user-avatar-circle">
                                <img src="https://ui-avatars.com/api/?name=Instagram&background=7c3aed&color=fff" alt="Company" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default CompanyNavbar;
