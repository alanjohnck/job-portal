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

import { companies as companiesData } from './data/companies';
import { jobs as jobsData } from './data/jobs'; // Assuming you want to show related jobs

const CompanyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [companyJobs, setCompanyJobs] = useState([]);

    useEffect(() => {
        // Find company by ID
        const companyId = parseInt(id) || 1;
        const foundCompany = companiesData.find(c => c.id === companyId) || companiesData[0];
        setCompany(foundCompany);

        // Find jobs for this company (mock logic: finding jobs with same company name)
        // In a real app, this would be an ID-based lookup or API call
        if (foundCompany) {
            const jobs = jobsData.filter(j => j.company === foundCompany.name);
            setCompanyJobs(jobs);
        }

        window.scrollTo(0, 0);
    }, [id]);

    if (!company) return <div>Loading...</div>;

    return (
        <div className="company-details-page">
            <Header />

            <div className="company-banner"></div>

            <main className="container company-content">
                <div className="back-link" onClick={() => navigate('/candidate/find-companies')} style={{ marginBottom: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-gray)' }}>
                    <FaArrowLeft /> Back to Companies
                </div>

                <div className="company-header-section">
                    <div className="company-logo-large-box">
                        <img src={company.logo} alt={company.name} onError={(e) => { e.target.src = 'https://via.placeholder.com/120?text=Logo' }} />
                    </div>

                    <div className="company-header-info">
                        <div className="company-title-row">
                            <h1>{company.name}</h1>
                            <span className="open-jobs-pill">{companyJobs.length} Open Positions</span>
                        </div>
                        <div className="company-meta-row">
                            <span><FaMapMarkerAlt /> {company.location}</span>
                            <span><FaBriefcase /> {company.industry}</span>
                            <span><FaUsers /> 500-1000 Employees</span>
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
                                {company.description}
                                <br /><br />
                                Add more detailed description logic here if needed. This is a placeholder for extended company descriptions, culture, values, and mission statements that might be fetched from an API.
                            </p>
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
                            <div className="side-row">
                                <span className="label">Founded</span>
                                <span className="value">2010</span>
                            </div>
                            <div className="side-row">
                                <span className="label">Organization Type</span>
                                <span className="value">Private Company</span>
                            </div>
                            <div className="side-row">
                                <span className="label">Company Size</span>
                                <span className="value">100-500 Employees</span>
                            </div>
                            <div className="side-row">
                                <span className="label">Phone</span>
                                <span className="value">+1-202-555-0178</span>
                            </div>
                            <div className="side-row">
                                <span className="label">Email</span>
                                <span className="value">careers@{company.name.toLowerCase()}.com</span>
                            </div>
                            <div className="side-row">
                                <span className="label">Website</span>
                                <a href="#" className="value link"><FaGlobe /> https://{company.name.toLowerCase()}.com</a>
                            </div>

                            <div className="social-links-row">
                                <a href="#" className="social-icon"><FaFacebookF /></a>
                                <a href="#" className="social-icon"><FaTwitter /></a>
                                <a href="#" className="social-icon"><FaLinkedinIn /></a>
                                <a href="#" className="social-icon"><FaInstagram /></a>
                            </div>
                        </div>

                        <div className="section-card">
                            <h3>Contact Us</h3>
                            <form className="mini-contact-form">
                                <input type="text" placeholder="Your Name" />
                                <input type="email" placeholder="Your Email" />
                                <textarea placeholder="Message"></textarea>
                                <button>Send Message</button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CompanyDetails;
