import React from 'react';
import './JobCard.css';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job, view = 'grid' }) => {
    const navigate = useNavigate();

    const companyName = job.company?.name || job.company || 'Company';
    const companyLogo = job.company?.logo || job.logo;
    const jobType = job.jobType || job.type || 'Full-time';
    const jobLocation = job.location || job.city || job.state || job.country || 'Remote';
    const salaryText = job.minSalary && job.maxSalary
        ? `$${job.minSalary.toLocaleString()} - $${job.maxSalary.toLocaleString()}`
        : (job.salary || '');

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
                    {companyLogo ? (
                        <img src={companyLogo} alt={`${companyName} logo`} className="logo-img" />
                    ) : (
                        companyName[0]
                    )}
                </div>
                <div className="title-section">
                    <h3 className="job-title-text">{job.title}</h3>
                    <div className="job-meta">
                        <span className="co-name">{companyName}</span>
                        <span className="dot">•</span>
                        <span className="co-loc">{jobLocation}</span>
                    </div>
                </div>
            </div>

            <div className="card-right-info">
                <div className="badge-group">
                    <span className={`type-badge ${jobType.toLowerCase().replace('-', '')}`}>
                        {jobType}
                    </span>
                    {salaryText && <span className="salary-text">{salaryText}</span>}
                </div>
                <button className="apply-btn-outline" onClick={handleApply}>Apply Now</button>
            </div>
        </div>
    );
};

export default JobCard;
