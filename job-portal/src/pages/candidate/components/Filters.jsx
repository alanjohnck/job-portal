import React from 'react';
import { FaMapMarkerAlt, FaFilter } from 'react-icons/fa';
import './Filters.css';

const Filters = () => {
  return (
    <div className="filters-section">
      <div className="find-job-title">
        <h2>Find Job</h2>
        <span>Home / Find Job</span>
      </div>
      <div className="filter-bar">
        <div className="filter-inputs">
          <div className="filter-input">
            <FaMapMarkerAlt />
            <input type="text" placeholder="Search by: Job title, Position, Keyword..." />
          </div>
          <div className="filter-input">
            <FaMapMarkerAlt />
            <input type="text" placeholder="City, state or zip code" />
          </div>
        </div>
        <div className="filter-actions">
          <button className="filters-button"><FaFilter /> Filters</button>
          <button className="find-job-button">Find Job</button>
        </div>
      </div>
      <div className="popular-searches">
        <span>Popular searches:</span>
        <a href="#">Front-end</a>
        <a href="#">Back-end</a>
        <a href="#">Development</a>
        <a href="#">PHP</a>
        <a href="#">Laravel</a>
        <a href="#">Developer</a>
        <a href="#">Team Lead</a>
        <a href="#">Product Testing</a>
        <a href="#">Javascript</a>
      </div>
    </div>
  );
};

export default Filters;
