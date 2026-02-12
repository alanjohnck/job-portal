import React from 'react';
import './JobCard.css';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job, view = 'grid' }) => {
    const navigate = useNavigate();

    const handleApply = (e) => {
        e.stopPropagation();
        // Handle apply logic or navigate to apply page
        navigate(`/candidate/job-details/${job.id}`);
    };

    const handleCardClick = () => {
        navigate(`/candidate/job-details/${job.id}`);
    };

    return (
        <div className={`job-card-v2 ${view}`} onClick={handleCardClick}>
            <div className="card-main-info">
                <div className="company-logo-square">
                    {job.logo ? (
                        <img src={job.logo} alt={`${job.company} logo`} className="logo-img" />
                    ) : (
                        job.company ? job.company[0] : 'C'
                    )}
                </div>
                <div className="title-section">
                    <h3 className="job-title-text">{job.title}</h3>
                    <div className="job-meta">
                        <span className="co-name">{job.company}</span>
                        <span className="dot">•</span>
                        <span className="co-loc">{job.location}</span>
                    </div>
                </div>
            </div>

            <div className="card-right-info">
                <div className="badge-group">
                    <span className={`type-badge ${job.type.toLowerCase().replace('-', '')}`}>
                        {job.type}
                    </span>
                    <span className="salary-text">{job.salary}</span>
                </div>
                <button className="apply-btn-outline" onClick={handleApply}>Apply Now</button>
            </div>
        </div>
    );
};

export default JobCard;
