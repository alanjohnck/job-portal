import React from 'react';
import './CompanyCard.css';
import { FaStar, FaBriefcase, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CompanyCard = ({ company }) => {
    const navigate = useNavigate();

    const handleViewProfile = () => {
        navigate(`/candidate/company-details/${company.id}`);
    };
    return (
        <div className="company-card">
            <div className="company-card-header">
                <div className="company-logo-wrapper">
                    <img src={company.logo} alt={`${company.name} logo`} className="company-logo" onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=Logo' }} />
                </div>
                <div className="company-badges">
                    <span className="open-jobs-badge">{company.openJobs} Open Jobs</span>
                </div>
            </div>

            <div className="company-card-body">
                <h3 className="company-name">{company.name}</h3>
                <div className="company-meta">
                    <span className="meta-item"><FaMapMarkerAlt /> {company.location}</span>
                </div>
                <p className="company-desc">{company.description}</p>

                <div className="company-tags">
                    {company.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="company-tag">{tag}</span>
                    ))}
                </div>
            </div>

            <div className="company-card-footer">
                <button className="view-company-btn" onClick={handleViewProfile}>View Profile</button>
            </div>
        </div>
    );
};

export default CompanyCard;
