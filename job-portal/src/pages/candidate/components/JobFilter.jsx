import React, { useState } from 'react';
import './JobFilter.css';
import { FaTimes, FaCircle } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';

const JobFilter = ({ onClose, onApply }) => {
    // Local state for filters
    const [selectedCategory, setSelectedCategory] = useState("All Category");
    const [selectedJobType, setSelectedJobType] = useState('');
    const [salaryRange, setSalaryRange] = useState([10, 100]); // Default values
    const [isRemote, setIsRemote] = useState(false);

    const categories = [
        "All Category",
        "Developments",
        "Business",
        "Finance & Accounting",
        "IT & Software",
        "Office Productivity",
        "Personal Development",
        "Design",
        "Marketing",
        "Photography & Video"
    ];

    const jobTypes = [
        { id: 'Full-time', label: 'Full Time' },
        { id: 'Part-time', label: 'Part-Time' },
        { id: 'Internship', label: 'Internship' },
        { id: 'Temporary', label: 'Temporary' },
        { id: 'Contract', label: 'Contract Base' },
    ];

    const salaryRanges = [
        { id: '10000-50000', label: '$10k - $50k' },
        { id: '50000-100000', label: '$50k - $100k' },
        { id: '100000-150000', label: '$100k - $150k' },
        { id: '150000-200000', label: '$150k - $200k' },
        { id: '200000-up', label: '$200k Up' },
        { id: 'custom', label: 'Custom' },
    ];

    const activeFilters = [
        // This is static in the original code, should probably be dynamic
        // "Search: UI/UX",
        // "Prague, Czech",
        // "Design",
        // "Fulltime",
        // "Salary $70,000 - $120,000"
    ];

    return (
        <div className="job-filter-sidebar">
            <div className="filter-header">
                <h3>Filters</h3>
                <button className="close-filter-btn" onClick={onClose}>
                    <IoCloseOutline size={24} />
                </button>
            </div>

            {/* Active filters section - commented out or make dynamic if needed */}
            {/* 
            <div className="active-filters-section">
                <p className="section-label">Active Filters:</p>
                <div className="active-tags-grid">
                    {activeFilters.map((filter, idx) => (
                        <div key={idx} className="filter-tag">
                            {filter} <FaTimes className="tag-close" />
                        </div>
                    ))}
                </div>
            </div> 
            */}

            <div className="filter-divider"></div>

            <div className="filter-section">
                <h4 className="section-title blue-title">Industry</h4>
                <ul className="category-list">
                    {categories.map((cat, index) => (
                        <li
                            key={index}
                            className={selectedCategory === cat ? 'active' : ''}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="filter-divider"></div>

            <div className="filter-section">
                <h4 className="section-title blue-title">Job Type</h4>
                <div className="radio-list">
                    {jobTypes.map(type => (
                        <label key={type.id} className="custom-radio">
                            <input
                                type="radio"
                                name="jobType"
                                checked={selectedJobType === type.id}
                                onChange={() => setSelectedJobType(type.id)}
                            />
                            <span className="radio-dot"></span>
                            {type.label}
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-divider"></div>

            <div className="filter-section">
                <h4 className="section-title blue-title">Salary (yearly)</h4>

                {/* Range slider UI - functionality implementation skipped for brevity, keeping UI */}
                <div className="range-slider-box">
                    <div className="range-track">
                        <div className="range-fill" style={{ left: '0%', right: '0%' }}></div>
                    </div>
                </div>

                <div className="radio-list salary-radios">
                    {salaryRanges.map((range) => (
                        <label key={range.id} className="custom-radio">
                            <input
                                type="radio"
                                name="salaryRange"
                                defaultChecked={range.id === '10000-100000'}
                                onChange={() => {
                                    // Parse range for simple logic
                                    if (range.id === 'custom') return;
                                    const parts = range.id.split('-');
                                    if (parts.length === 2) setSalaryRange([parseInt(parts[0]), parseInt(parts[1])]);
                                    else if (parts[1] === 'up') setSalaryRange([parseInt(parts[0]), 'up']);
                                }}
                            />
                            <span className="radio-dot"></span>
                            {range.label}
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-divider"></div>

            <div className="filter-footer">
                <div className="remote-toggle">
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={isRemote}
                            onChange={() => setIsRemote(!isRemote)}
                        />
                        <span className="slider round"></span>
                    </label>
                    <span className="toggle-text">Remote Job</span>
                </div>
                <button className="apply-btn-blue" onClick={() => {
                    if (onApply) {
                        onApply({
                            category: selectedCategory === "All Category" ? "" : selectedCategory,
                            jobType: selectedJobType,
                            minSalary: salaryRange[0],
                            maxSalary: salaryRange[1] === 'up' ? null : salaryRange[1],
                            isRemote
                        });
                    }
                }}>Apply Filter</button>
            </div>
        </div>
    );
};

export default JobFilter;
