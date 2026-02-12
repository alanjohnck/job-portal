import React, { useState } from 'react';
import CompanyNavbar from './components/CompanyNavbar';
import CompanySidebar from './components/CompanySidebar';
import { FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
import './PostJob.css';

const PostJob = () => {
    const [benefits, setBenefits] = useState([
        "401k Salary", "Distributed Team", "Async", "Vision Insurance", "Dental Insurance",
        "Medical Insurance", "Unlimited vacation", "4 day workweek", "401k matching",
        "company retreats", "Learning budget", "Free gym membership", "Pay in crypto",
        "Profit Sharing", "Equity Compensation", "No whiteboard interview", "No politics at work", "We hire old (and young)"
    ]);
    const [selectedBenefits, setSelectedBenefits] = useState(["Distributed Team", "Medical Insurance", "401k matching", "company retreats", "We hire old (and young)"]);

    const toggleBenefit = (benefit) => {
        if (selectedBenefits.includes(benefit)) {
            setSelectedBenefits(selectedBenefits.filter(b => b !== benefit));
        } else {
            setSelectedBenefits([...selectedBenefits, benefit]);
        }
    };

    return (
        <div className="comp-layout">
            <CompanyNavbar />
            <div className="comp-container">
                <div className="container comp-flex">
                    <CompanySidebar />

                    <main className="comp-main-content">
                        <div className="post-job-header">
                            <h1>Post a job</h1>
                        </div>

                        <div className="post-job-form">
                            {/* Job Title */}
                            <div className="form-section">
                                <div className="form-group">
                                    <label className="input-label">Job Title</label>
                                    <input type="text" className="premium-input" placeholder="Add job title, role, vacancies etc" />
                                </div>
                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label className="input-label">Tags</label>
                                        <input type="text" className="premium-input" placeholder="Job keyword, tags etc..." />
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">Job Role</label>
                                        <select className="premium-select">
                                            <option>Select...</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Salary */}
                            <div className="form-section">
                                <h3 className="section-title">Salary</h3>
                                <div className="salary-grid">
                                    <div className="form-group">
                                        <label className="input-label">Min Salary</label>
                                        <div className="input-with-suffix">
                                            <input type="text" className="premium-input" placeholder="Minimum salary..." />
                                            <span className="suffix">USD</span>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">Max Salary</label>
                                        <div className="input-with-suffix">
                                            <input type="text" className="premium-input" placeholder="Maximum salary..." />
                                            <span className="suffix">USD</span>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">Salary Type</label>
                                        <select className="premium-select">
                                            <option>Select...</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Advance Information */}
                            <div className="form-section">
                                <h3 className="section-title">Advance Information</h3>
                                <div className="advance-grid">
                                    <div className="form-group">
                                        <label className="input-label">Education</label>
                                        <select className="premium-select"><option>Select...</option></select>
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">Experience</label>
                                        <select className="premium-select"><option>Select...</option></select>
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">Job Type</label>
                                        <select className="premium-select"><option>Select...</option></select>
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">Vacancies</label>
                                        <select className="premium-select"><option>Select...</option></select>
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">Expiration Date</label>
                                        <div className="date-input-wrapper">
                                            <input type="text" className="premium-input" placeholder="DD/MM/YYYY" />
                                            <FaCalendarAlt className="date-icon" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">Job Level</label>
                                        <select className="premium-select"><option>Select...</option></select>
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="form-section-bg location-section">
                                <h3 className="section-title">Location</h3>
                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label className="input-label">Country</label>
                                        <select className="premium-select"><option>Select...</option></select>
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">City</label>
                                        <select className="premium-select"><option>Select...</option></select>
                                    </div>
                                </div>
                                <div className="checkbox-group">
                                    <input type="checkbox" id="remote" defaultChecked />
                                    <label htmlFor="remote">Fully Remote Position - <strong>Worldwide</strong></label>
                                </div>
                            </div>

                            {/* Job Benefits */}
                            <div className="form-section">
                                <h3 className="section-title">Job Benefits</h3>
                                <div className="benefits-cloud">
                                    {benefits.map(benefit => (
                                        <button
                                            key={benefit}
                                            className={`benefit-tag ${selectedBenefits.includes(benefit) ? 'active' : ''}`}
                                            onClick={() => toggleBenefit(benefit)}
                                        >
                                            {benefit}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Job Description */}
                            <div className="form-section">
                                <h3 className="section-title">Job Description</h3>
                                <div className="rich-textarea-container">
                                    <textarea className="premium-textarea" placeholder="Add your job description..."></textarea>
                                    <div className="textarea-toolbar">
                                        <button className="tool-btn"><strong>B</strong></button>
                                        <button className="tool-btn"><em>I</em></button>
                                        <button className="tool-btn"><u>U</u></button>
                                        <div className="tool-divider"></div>
                                        <button className="tool-btn">#</button>
                                        <button className="tool-btn">...</button>
                                    </div>
                                </div>
                            </div>

                            {/* Apply Job on */}
                            <div className="form-section-bg apply-on-section">
                                <h3 className="section-title">Apply Job on:</h3>
                                <div className="apply-grid">
                                    <label className="apply-option">
                                        <input type="radio" name="apply-method" defaultChecked />
                                        <div className="option-content">
                                            <span className="option-title">On Jobpilot</span>
                                            <span className="option-desc">Candidate will apply job using jobpilot & all application will show on your dashboard.</span>
                                        </div>
                                    </label>
                                    <label className="apply-option">
                                        <input type="radio" name="apply-method" />
                                        <div className="option-content">
                                            <span className="option-title">External Platform</span>
                                            <span className="option-desc">Candidate apply job on your website, all application on your own website.</span>
                                        </div>
                                    </label>
                                    <label className="apply-option">
                                        <input type="radio" name="apply-method" />
                                        <div className="option-content">
                                            <span className="option-title">On Your Email</span>
                                            <span className="option-desc">Candidate apply job on your email address, and all application in your email.</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="post-job-footer">
                                <button className="post-job-primary-btn">
                                    Post Job <FaArrowRight />
                                </button>
                            </div>
                        </div>

                        <footer className="comp-footer">
                            <div className="container">
                                <p>© 2021 Jobpilot - Job Board. All rights Reserved</p>
                            </div>
                        </footer>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default PostJob;
