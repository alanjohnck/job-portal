import React from 'react';
import './CompanyCard.css';
import { FaStar, FaBriefcase, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CompanyCard = ({ company }) => {
    const navigate = useNavigate();

    const handleViewProfile = () => {
        navigate(`/candidate/company-details/${company.id}`);
    };

    // Handle both old mock data format and new API format
    const companyName = company.companyName || company.name;
    const companyLogo = company.logo;
    const companyLocation = company.location;
    const companyDescription = company.description;
    const openJobs = company.openJobs || 0;
    const tags = company.techStack || company.tags || [];

    return (
        <div className="company-card">
            <div className="company-card-header">
                <div className="company-logo-wrapper">
                    <img 
                        src={companyLogo || 'https://via.placeholder.com/80?text=Logo'} 
                        alt={`${companyName} logo`} 
                        className="company-logo" 
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=Logo' }} 
                    />
                </div>
                <div className="company-badges">
                    <span className="open-jobs-badge">{openJobs} Open Jobs</span>
                </div>
            </div>

            <div className="company-card-body">
                <h3 className="company-name">{companyName}</h3>
                <div className="company-meta">
                    <span className="meta-item"><FaMapMarkerAlt /> {companyLocation || 'N/A'}</span>
                </div>
                <p className="company-desc">
                    {companyDescription ? 
                        (companyDescription.length > 120 ? companyDescription.substring(0, 120) + '...' : companyDescription) 
                        : 'No description available'
                    }
                </p>

                <div className="company-tags">
                    {tags.slice(0, 3).map((tag, index) => (
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
