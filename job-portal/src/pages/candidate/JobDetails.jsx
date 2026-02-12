import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import JobCard from './components/JobCard';
import './JobDetails.css';
import { getJobDetails, getJobs } from '../../services/api';
import { formatSalary, formatDate } from '../../utils/formatters';
import {
    FaMapMarkerAlt,
    FaDollarSign,
    FaBriefcase,
    FaClock,
    FaShareAlt,
    FaBookmark,
    FaArrowLeft,
    FaFacebookF,
    FaTwitter,
    FaLinkedinIn,
    FaEnvelope,
    FaCalendarAlt,
    FaGraduationCap,
    FaHourglassHalf,
    FaLayerGroup,
    FaCheckCircle
} from 'react-icons/fa';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [relatedJobs, setRelatedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            setLoading(true);
            try {
                const response = await getJobDetails(id);
                if (response.success) {
                    const apiJob = response.data;
                    const mappedJob = {
                        id: apiJob.id,
                        title: apiJob.title,
                        company: apiJob.company?.name || 'Unknown',
                        logo: apiJob.company?.logo,
                        type: apiJob.jobType,
                        salary: formatSalary(apiJob.minSalary, apiJob.maxSalary, apiJob.salaryCurrency, apiJob.salaryPeriod),
                        posted: formatDate(apiJob.createdAt),
                        description: apiJob.description || '',
                        location: apiJob.location,
                        deadline: formatDate(apiJob.deadline),
                        education: apiJob.education,
                        experience: apiJob.experience,
                        level: apiJob.experienceLevel,
                    };
                    setJob(mappedJob);

                    // Fetch related jobs based on category, excluding current job
                    const relatedResp = await getJobs({
                        category: apiJob.category,
                        pageSize: 4
                    });

                    if (relatedResp.success) {
                        const related = relatedResp.data.items
                            .filter(j => j.id !== apiJob.id)
                            .slice(0, 3)
                            .map(j => ({
                                id: j.id,
                                title: j.title,
                                company: j.company?.name,
                                logo: j.company?.logo,
                                location: j.location,
                                type: j.jobType,
                                salary: formatSalary(j.minSalary, j.maxSalary, j.salaryCurrency),
                                posted: formatDate(j.createdAt),
                                level: j.experienceLevel,
                                education: j.education,
                                experience: j.experience
                            }));
                        setRelatedJobs(related);
                    }
                }
            } catch (error) {
                console.error("Error fetching job details:", error);
            } finally {
                setLoading(false);
            }
            window.scrollTo(0, 0);
        };

        if (id) fetchJob();
    }, [id]);

    const [showApplyModal, setShowApplyModal] = useState(false);
    const [applied, setApplied] = useState(false);

    if (loading) return <div className="loading-spinner">Loading job details...</div>;
    if (!job) return <div className="not-found">Job not found or failed to load.</div>;

    const handleApply = () => {
        setShowApplyModal(true);
    };

    const handleFinalSubmit = (e) => {
        e.preventDefault();
        setApplied(true);
        setTimeout(() => setShowApplyModal(false), 2000);
    };

    return (
        <div className="job-details-page">
            <Header />

            {showApplyModal && (
                <div className="modal-overlay">
                    <div className="apply-modal">
                        {!applied ? (
                            <>
                                <h2>Apply for {job.title}</h2>
                                <p>Please upload your resume to complete the application.</p>
                                <form className="upload-form" onSubmit={handleFinalSubmit}>
                                    <div className="upload-box" onClick={() => document.getElementById('resume-file').click()}>
                                        <FaBriefcase className="upload-icon" />
                                        <span>Click to upload PDF or DOCX</span>
                                        <input type="file" id="resume-file" hidden accept=".pdf,.doc,.docx" required />
                                    </div>
                                    <div className="modal-actions">
                                        <button type="button" className="cancel-btn" onClick={() => setShowApplyModal(false)}>Cancel</button>
                                        <button type="submit" className="submit-btn">Submit Application</button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="success-message">
                                <FaCheckCircle className="success-icon" />
                                <h3>Applied Successfully!</h3>
                                <p>You will be notified once the recruiter reviews your profile.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <main className="details-content">
                <div className="back-link" onClick={() => navigate('/candidate/find-jobs')}>
                    <FaArrowLeft /> Back to Find Jobs
                </div>

                {/* Header Section */}
                <div className="job-header-card">
                    <div className="header-left">
                        <div className="company-logo-large">
                            {job.logo ? (
                                <img src={job.logo} alt={`${job.company} logo`} className="logo-img-large" />
                            ) : (
                                job.company ? job.company[0] : 'C'
                            )}
                        </div>
                        <div>
                            <h1 className="job-title-large">{job.title}</h1>
                            <div className="job-info-row">
                                <span>{job.company}</span>
                                <span className="dot">•</span>
                                <span className={`type-badge ${job.type.toLowerCase().replace('-', '')}`}>{job.type}</span>
                                <span className="dot">•</span>
                                <span>{job.posted ? `Posted ${job.posted}` : 'Recently'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="header-actions">
                        <button className="save-btn"><FaBookmark /></button>
                        <button className="apply-btn-primary" onClick={handleApply}>{applied ? 'Applied' : 'Apply Now'}</button>
                    </div>
                </div>

                <div className="details-grid">
                    {/* Main Column */}
                    <div className="left-column">
                        <div className="section-title">Job Description</div>
                        <div className="description-text">
                            {job.description.split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>

                        <div className="section-title">Share this job:</div>
                        <div className="share-links">
                            <button className="share-btn"><FaFacebookF /></button>
                            <button className="share-btn"><FaTwitter /></button>
                            <button className="share-btn"><FaLinkedinIn /></button>
                            <button className="share-btn"><FaEnvelope /></button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="right-column">
                        <div className="sidebar-card">
                            <div className="salary-summary">
                                <span className="salary-amount">{job.salary}</span>
                                <span className="salary-label">Avg. Salary</span>
                            </div>

                            <div className="sidebar-rows">
                                <div className="sidebar-row">
                                    <div className="sidebar-label"><FaMapMarkerAlt /> Location</div>
                                    <div className="sidebar-value">{job.location}</div>
                                </div>
                                <div className="sidebar-row">
                                    <div className="sidebar-label"><FaBriefcase /> Job Type</div>
                                    <div className="sidebar-value">{job.type}</div>
                                </div>
                            </div>
                        </div>

                        <div className="sidebar-card">
                            <div className="section-title">Job Overview</div>
                            <div className="sidebar-rows">
                                <div className="sidebar-row">
                                    <div className="sidebar-label"><FaCalendarAlt /> Posted On</div>
                                    <div className="sidebar-value">{job.posted || 'N/A'}</div>
                                </div>
                                <div className="sidebar-row">
                                    <div className="sidebar-label"><FaHourglassHalf /> Deadline</div>
                                    <div className="sidebar-value">{job.deadline || 'Open'}</div>
                                </div>
                                <div className="sidebar-row">
                                    <div className="sidebar-label"><FaGraduationCap /> Education</div>
                                    <div className="sidebar-value">{job.education || 'Any'}</div>
                                </div>
                                <div className="sidebar-row">
                                    <div className="sidebar-label"><FaBriefcase /> Experience</div>
                                    <div className="sidebar-value">{job.experience || 'Entry'}</div>
                                </div>
                                <div className="sidebar-row">
                                    <div className="sidebar-label"><FaLayerGroup /> Level</div>
                                    <div className="sidebar-value">{job.level || 'Entry Level'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Jobs */}
                <div className="related-jobs-section">
                    <div className="section-title">Related Jobs</div>
                    <div className="related-jobs-grid">
                        {relatedJobs.map(relatedJob => (
                            <JobCard key={relatedJob.id} job={relatedJob} view="grid" />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default JobDetails;
