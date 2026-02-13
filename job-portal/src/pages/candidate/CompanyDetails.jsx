import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import JobCard from './components/JobCard';
import './CompanyDetails.css';
import {
    FaMapMarkerAlt,
    FaGlobe,
    FaUsers,
    FaBriefcase,
    FaArrowLeft,
    FaFacebookF,
    FaTwitter,
    FaLinkedinIn,
    FaInstagram
} from 'react-icons/fa';

import { getCompanyDetails, getCompanyJobsByCompanyId } from '../../services/api';

const CompanyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [companyJobs, setCompanyJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCompanyData();
        window.scrollTo(0, 0);
    }, [id]);

    const fetchCompanyData = async () => {
        try {
            setLoading(true);
            setError('');

            // Fetch company details and jobs in parallel
            const [companyRes, jobsRes] = await Promise.all([
                getCompanyDetails(id),
                getCompanyJobsByCompanyId(id, 1, 10)
            ]);

            if (companyRes.success) {
                setCompany(companyRes.data);
            } else {
                setError('Company not found');
            }

            if (jobsRes.success && jobsRes.data?.items) {
                setCompanyJobs(jobsRes.data.items);
            }
        } catch (err) {
            console.error('Error fetching company data:', err);
            setError('Failed to load company details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="company-details-page">
                <Header />
                <main className="container company-content">
                    <div className="loading-message">Loading company details...</div>
                </main>
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className="company-details-page">
                <Header />
                <main className="container company-content">
                    <div className="error-message">{error || 'Company not found'}</div>
                    <button onClick={() => navigate('/candidate/find-companies')} className="primary-btn">
                        Back to Companies
                    </button>
                </main>
            </div>
        );
    }

    const companyLocation = company.city && company.state 
        ? `${company.city}, ${company.state}` 
        : company.city || company.country || 'N/A';

    const formatFoundedYear = (founded) => {
        if (!founded) return 'N/A';
        return new Date(founded).getFullYear();
    };

    return (
        <div className="company-details-page">
            <Header />

            <div 
                className="company-banner" 
                style={{ 
                    backgroundImage: company.bannerImage 
                        ? `url(${company.bannerImage})` 
                        : 'linear-gradient(to right, #4f46e5, #9333ea)'
                }}
            ></div>

            <main className="container company-content">
                <div className="back-link" onClick={() => navigate('/candidate/find-companies')} style={{ marginBottom: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-gray)' }}>
                    <FaArrowLeft /> Back to Companies
                </div>

                <div className="company-header-section">
                    <div className="company-logo-large-box">
                        <img 
                            src={company.logo || 'https://via.placeholder.com/120?text=Logo'} 
                            alt={company.companyName} 
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/120?text=Logo' }} 
                        />
                    </div>

                    <div className="company-header-info">
                        <div className="company-title-row">
                            <h1>{company.companyName}</h1>
                            <span className="open-jobs-pill">{companyJobs.length} Open Positions</span>
                        </div>
                        <div className="company-meta-row">
                            <span><FaMapMarkerAlt /> {companyLocation}</span>
                            {company.industry && <span><FaBriefcase /> {company.industry}</span>}
                            {company.companySize && <span><FaUsers /> {company.companySize} Employees</span>}
                        </div>
                    </div>

                    <div className="company-actions">
                        <button className="primary-btn">Follow</button>
                    </div>
                </div>

                <div className="company-grid-layout">
                    <div className="main-col">
                        <div className="section-card">
                            <h3>About Company</h3>
                            <p className="description-text">
                                {company.description || 'No description available.'}
                            </p>
                            
                            {company.techStack && company.techStack.length > 0 && (
                                <div style={{ marginTop: '20px' }}>
                                    <h4>Tech Stack</h4>
                                    <div className="company-tags" style={{ marginTop: '10px' }}>
                                        {company.techStack.map((tech, index) => (
                                            <span key={index} className="company-tag">{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="section-card">
                            <h3>Open Positions</h3>
                            <div className="company-jobs-list">
                                {companyJobs.length > 0 ? (
                                    companyJobs.map(job => (
                                        <JobCard key={job.id} job={job} view="list" />
                                    ))
                                ) : (
                                    <p>No open positions found.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="side-col">
                        <div className="section-card side-info">
                            {company.founded && (
                                <div className="side-row">
                                    <span className="label">Founded</span>
                                    <span className="value">{formatFoundedYear(company.founded)}</span>
                                </div>
                            )}
                            <div className="side-row">
                                <span className="label">Organization Type</span>
                                <span className="value">Private Company</span>
                            </div>
                            {company.companySize && (
                                <div className="side-row">
                                    <span className="label">Company Size</span>
                                    <span className="value">{company.companySize} Employees</span>
                                </div>
                            )}
                            {company.phoneNumber && (
                                <div className="side-row">
                                    <span className="label">Phone</span>
                                    <span className="value">{company.phoneNumber}</span>
                                </div>
                            )}
                            {company.companyEmail && (
                                <div className="side-row">
                                    <span className="label">Email</span>
                                    <span className="value">{company.companyEmail}</span>
                                </div>
                            )}
                            {company.website && (
                                <div className="side-row">
                                    <span className="label">Website</span>
                                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="value link">
                                        <FaGlobe /> {company.website}
                                    </a>
                                </div>
                            )}

                            <div className="social-links-row">
                                {company.facebookUrl && (
                                    <a href={company.facebookUrl} target="_blank" rel="noopener noreferrer" className="social-icon">
                                        <FaFacebookF />
                                    </a>
                                )}
                                {company.twitterUrl && (
                                    <a href={company.twitterUrl} target="_blank" rel="noopener noreferrer" className="social-icon">
                                        <FaTwitter />
                                    </a>
                                )}
                                {company.linkedInUrl && (
                                    <a href={company.linkedInUrl} target="_blank" rel="noopener noreferrer" className="social-icon">
                                        <FaLinkedinIn />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="section-card">
                            <h3>Contact Us</h3>
                            <form className="mini-contact-form">
                                <input type="text" placeholder="Your Name" />
                                <input type="email" placeholder="Your Email" />
                                <textarea placeholder="Message"></textarea>
                                <button type="button">Send Message</button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CompanyDetails;
