import React from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaPhoneAlt, FaBell, FaUserCircle, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  return (
    <header className="main-header">
      {/* Top Utility Bar */}
      <div className="utility-bar">
        <div className="container header-flex">
          <div className="utility-left">
            <Link to="/">Home</Link>
            <Link to="/candidate/find-companies">Find Employers</Link>
            <Link to="/candidate/dashboard">Dashboard</Link>
            <Link to="/candidate/profile">My Profile</Link>
            <Link to="/candidate/customer-support">Customer Support</Link>
          </div>
          <div className="utility-right">
            <span className="contact-item"><FaPhoneAlt size={12} /> +1-202-555-0178</span>
            <span className="language-item">English</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="nav-bar">
        <div className="container header-flex">
          <div className="nav-left">
            <Link to="/" className="logo">
              <div className="logo-icon"><FaBriefcase /></div>
            </Link>

            {/* Integrated Search Container */}
            <div className="header-search">
              <div className="search-group">
                <FaSearch className="search-icon" />
                <input type="text" placeholder="Job title, keyword..." />
              </div>
              <div className="search-divider"></div>
              <div className="search-group">
                <FaMapMarkerAlt className="search-icon" />
                <input type="text" placeholder="India" />
              </div>
              <button className="header-search-btn">Search</button>
            </div>
          </div>

          <div className="nav-right">
            <div className="user-nav">

              <div className="user-profile-trigger">
                <FaUserCircle size={32} />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;