import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="header">
      <div className="logo">Jobpilot</div>
      <div className="search-bar">
        <input type="text" placeholder="Job tittle, keyword, company" />
      </div>
      <div className="user-profile">
        <span>User</span>
      </div>
    </header>
  );
};

export default Navbar;
