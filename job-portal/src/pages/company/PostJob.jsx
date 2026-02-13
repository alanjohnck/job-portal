import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyNavbar from './components/CompanyNavbar';
import CompanySidebar from './components/CompanySidebar';
import { FaArrowRight, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import { createJob } from '../../services/api';
import './PostJob.css';

const PostJob = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        tags: '',
        jobType: '',
        minSalary: '',
        maxSalary: '',
        salaryCurrency: 'USD',
        salaryPeriod: 'Yearly',
        education: '',
        experience: '',
        experienceLevel: '',
        openings: '',
        deadline: '',
        country: '',
        city: '',
        isRemote: true,
        description: '',
        requirements: '',
        responsibilities: ''
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validate required fields
            if (!formData.title || !formData.jobType || !formData.description) {
                throw new Error('Please fill in all required fields');
            }

            // Prepare the job data
            const jobData = {
                title: formData.title,
                description: formData.description,
                requirements: formData.requirements ? formData.requirements.split('\n').filter(r => r.trim()) : [],
                responsibilities: formData.responsibilities ? formData.responsibilities.split('\n').filter(r => r.trim()) : [],
                jobType: formData.jobType,
                experienceLevel: formData.experienceLevel || 'Entry Level',
                minSalary: formData.minSalary ? parseFloat(formData.minSalary) : null,
                maxSalary: formData.maxSalary ? parseFloat(formData.maxSalary) : null,
                salaryCurrency: formData.salaryCurrency,
                salaryPeriod: formData.salaryPeriod,
                location: formData.isRemote ? 'Remote' : `${formData.city}, ${formData.country}`,
                city: formData.city || null,
                country: formData.country || null,
                isRemote: formData.isRemote,
                requiredSkills: [],
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
                category: null,
                deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
                openings: formData.openings ? parseInt(formData.openings) : null,
                education: formData.education || null,
                experience: formData.experience || null,
                status: 'Active'
            };

            const response = await createJob(jobData);

            if (response.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/company/my-jobs');
                }, 2000);
            } else {
                throw new Error(response.error?.message || 'Failed to create job');
            }
        } catch (err) {
            console.error('Error creating job:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const [benefits, setBenefits] = useState([
        "401k Salary", "Distributed Team", "Async", "Vision Insurance", "Dental Insurance",
        "Medical Insurance", "Unlimited vacation", "4 day workweek", "401k matching",
        "company retreats", "Learning budget", "Free gym membership", "Pay in crypto",
        "Profit Sharing", "Equity Compensation", "No whiteboard interview", "No politics at work", "We hire old (and young)"
    ]);
    const [selectedBenefits, setSelectedBenefits] = useState([]);

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

                        {success && (
                            <div className="success-banner">
                                <FaCheckCircle /> Job posted successfully! Redirecting...
                            </div>
                        )}

                        {error && (
                            <div className="error-banner">
                                {error}
                            </div>
                        )}

                        <form className="post-job-form" onSubmit={handleSubmit}>
                            {/* Job Title */}
                            <div className="form-section">
                                <div className="form-group">
                                    <label className="input-label">Job Title *</label>
                                    <input 
                                        type="text" 
                                        name="title"
                                        className="premium-input" 
                                        placeholder="Add job title, role, vacancies etc" 
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label className="input-label">Tags</label>
                                        <input 
                                            type="text" 
                                            name="tags"
                                            className="premium-input" 
                                            placeholder="Job keyword, tags etc (comma separated)" 
                                            value={formData.tags}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">Job Type *</label>
                                        <select 
                                            name="jobType"
                                            className="premium-select"
                                            value={formData.jobType}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select...</option>
                                            <option value="Full-Time">Full-Time</option>
                                            <option value="Part-Time">Part-Time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Internship">Internship</option>
                                            <option value="Freelance">Freelance</option>
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
                                            <input 
                                                type="number" 
                                                name="minSalary"
                                                className="premium-input" 
                                                placeholder="Minimum salary..." 
                                                value={formData.minSalary}
                                                onChange={handleInputChange}
                                            />
                                            <span className="suffix">{formData.salaryCurrency}</span>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">Max Salary</label>
                                        <div className="input-with-suffix">
                                            <input 
                                                type="number" 
                                                name="maxSalary"
                                                className="premium-input" 
                                                placeholder="Maximum salary..." 
                                                value={formData.maxSalary}
                                                onChange={handleInputChange}
                                            />
                                            <span className="suffix">{formData.salaryCurrency}</span>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">Salary Period</label>
                                        <select 
                                            name="salaryPeriod"
                                            className="premium-select"
                                            value={formData.salaryPeriod}
                                            onChange={handleInputChange}
                                        >
                                            <option value="Yearly">Yearly</option>
                                            <option value="Monthly">Monthly</option>
                                            <option value="Weekly">Weekly</option>
                                            <option value="Hourly">Hourly</option>
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
                                        <select 
                                            name="education"
                                            className="premium-select"
                                            value={formData.education}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select...</option>
                                            <option value="High School">High School</option>
                                            <option value="Associate Degree">Associate Degree</option>
                                            <option value="Bachelor Degree">Bachelor Degree</option>
                                            <option value="Master Degree">Master Degree</option>
                                            <option value="PhD">PhD</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">Experience</label>
                                        <input 
                                            type="text" 
                                            name="experience"
                                            className="premium-input" 
                                            placeholder="e.g. 2-5 years"
                                            value={formData.experience}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">Experience Level</label>
                                        <select 
                                            name="experienceLevel"
                                            className="premium-select"
                                            value={formData.experienceLevel}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select...</option>
                                            <option value="Entry Level">Entry Level</option>
                                            <option value="Mid Level">Mid Level</option>
                                            <option value="Senior Level">Senior Level</option>
                                            <option value="Executive">Executive</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">Vacancies</label>
                                        <input 
                                            type="number" 
                                            name="openings"
                                            className="premium-input" 
                                            placeholder="Number of positions"
                                            value={formData.openings}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">Expiration Date</label>
                                        <div className="date-input-wrapper">
                                            <input 
                                                type="date" 
                                                name="deadline"
                                                className="premium-input"
                                                value={formData.deadline}
                                                onChange={handleInputChange}
                                            />
                                            <FaCalendarAlt className="date-icon" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="form-section-bg location-section">
                                <h3 className="section-title">Location</h3>
                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label className="input-label">Country</label>
                                        <input 
                                            type="text" 
                                            name="country"
                                            className="premium-input" 
                                            placeholder="Enter country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            disabled={formData.isRemote}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">City</label>
                                        <input 
                                            type="text" 
                                            name="city"
                                            className="premium-input" 
                                            placeholder="Enter city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            disabled={formData.isRemote}
                                        />
                                    </div>
                                </div>
                                <div className="checkbox-group">
                                    <input 
                                        type="checkbox" 
                                        id="remote" 
                                        name="isRemote"
                                        checked={formData.isRemote}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="remote">Fully Remote Position - <strong>Worldwide</strong></label>
                                </div>
                            </div>

                            {/* Job Description */}
                            <div className="form-section">
                                <h3 className="section-title">Job Description *</h3>
                                <div className="rich-textarea-container">
                                    <textarea 
                                        name="description"
                                        className="premium-textarea" 
                                        placeholder="Add your job description..."
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        rows="6"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Requirements */}
                            <div className="form-section">
                                <h3 className="section-title">Requirements (Optional)</h3>
                                <div className="rich-textarea-container">
                                    <textarea 
                                        name="requirements"
                                        className="premium-textarea" 
                                        placeholder="Enter each requirement on a new line..."
                                        value={formData.requirements}
                                        onChange={handleInputChange}
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Responsibilities */}
                            <div className="form-section">
                                <h3 className="section-title">Responsibilities (Optional)</h3>
                                <div className="rich-textarea-container">
                                    <textarea 
                                        name="responsibilities"
                                        className="premium-textarea" 
                                        placeholder="Enter each responsibility on a new line..."
                                        value={formData.responsibilities}
                                        onChange={handleInputChange}
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="post-job-footer">
                                <button type="submit" className="post-job-primary-btn" disabled={loading}>
                                    {loading ? 'Posting...' : 'Post Job'} <FaArrowRight />
                                </button>
                            </div>
                        </form>

                        

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
