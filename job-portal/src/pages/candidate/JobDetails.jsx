import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import JobCard from './components/JobCard';
import './JobDetails.css';
import { getJobDetails, getJobs, applyForJob, saveJob, unsaveJob } from '../../services/api';
import { formatSalary, formatDate } from '../../utils/formatters';
import {
    FaMapMarkerAlt,
    FaDollarSign,
    FaBriefcase,
    FaClock,
    FaShareAlt,
    FaBookmark,
    FaRegBookmark,
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
import { IoBookmark, IoBookmarkOutline } from 'react-icons/io5';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [relatedJobs, setRelatedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            setLoading(true);
            try {
                const response = await getJobDetails(id);
                if (response && response.id) {
                    const apiJob = response;
                    const mappedJob = {
                        id: apiJob.id,
                        title: apiJob.title,
                        company: apiJob.company?.name || 'Unknown',
                        logo: apiJob.company?.logo,
                        type: apiJob.jobType || 'Full-time',
                        salary: formatSalary(apiJob.minSalary, apiJob.maxSalary, apiJob.salaryCurrency, apiJob.salaryPeriod),
                        posted: formatDate(apiJob.createdAt),
                        description: apiJob.description || '',
                        location: apiJob.location,
                        deadline: formatDate(apiJob.deadline),
                        education: apiJob.education,
                        experience: apiJob.experience,
                        level: apiJob.experienceLevel,
                        responsibilities: apiJob.responsibilities || [],
                        requirements: apiJob.requirements || [], // This seems to map to 'skills' or 'qualifications' conceptually based on the screenshot
                        skills: apiJob.requiredSkills || []
                    };
                    setJob(mappedJob);
                    setIsSaved(!!apiJob.isSaved);

                    // Fetch related jobs based on category, excluding current job
                    const relatedResp = await getJobs({
                        category: apiJob.category,
                        pageSize: 4
                    });

                    if (relatedResp && relatedResp.items) {
                        const related = relatedResp.items
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
    const [applyLoading, setApplyLoading] = useState(false);
    const [applyError, setApplyError] = useState(null);
    const [sharePortfolio, setSharePortfolio] = useState(false);
    const [resumeUrl, setResumeUrl] = useState('');
    const [resumeFile, setResumeFile] = useState(null);

    if (loading) return <div className="loading-spinner">Loading job details...</div>;
    if (!job) return <div className="not-found">Job not found or failed to load.</div>;

    const handleApply = () => {
        setShowApplyModal(true);
        setApplyError(null);
    };

    const handleToggleSave = async () => {
        if (!job?.id) return;
        setSaveLoading(true);
        try {
            if (isSaved) {
                await unsaveJob(job.id);
                setIsSaved(false);
            } else {
                await saveJob(job.id);
                setIsSaved(true);
            }
        } catch (err) {
            console.error('Error toggling save job:', err);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setResumeFile(file);
            // In a real app, you would upload this to a server and get a URL
            // For now, we'll simulate with a placeholder
            setResumeUrl(`http://localhost:5173/resumes/${file.name}`);
        }
    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        setApplyLoading(true);
        setApplyError(null);

        try {
            // Validate inputs
            if (!resumeUrl && !resumeFile) {
                throw new Error('Please upload a resume or provide a resume URL');
            }

            // In a production app, you would upload the file to a storage service first
            // and get the URL. For now, we'll use the URL directly or the simulated one
            const finalResumeUrl = resumeUrl || `http://localhost:5173/resumes/${resumeFile?.name}`;

            let finalCoverLetter = '';
            if (sharePortfolio) {
                finalCoverLetter = (finalCoverLetter || '') + '\n\n[Portfolio Shared]';
            }

            const response = await applyForJob(id, finalCoverLetter, finalResumeUrl);

            if (response.success) {
                setApplied(true);
                setTimeout(() => {
                    setShowApplyModal(false);
                    setApplied(true);
                }, 2000);
            } else {
                throw new Error(response.error?.message || 'Failed to apply for job');
            }
        } catch (err) {
            console.error('Error applying for job:', err);
            setApplyError(err.message);
        } finally {
            setApplyLoading(false);
        }
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
                                <p>Please provide your details to complete the application.</p>

                                {applyError && (
                                    <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
                                        {applyError}
                                    </div>
                                )}

                                <form className="upload-form" onSubmit={handleFinalSubmit}>
                                    <div className="form-group-compact">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={sharePortfolio}
                                                onChange={(e) => setSharePortfolio(e.target.checked)}
                                            />
                                            <span>Share my portfolio with the recruiter</span>
                                        </label>
                                    </div>

                                    {!resumeFile ? (
                                        <>
                                            <div className="form-group-compact">
                                                <label className="input-label">Resume URL (Optional)</label>
                                                <input
                                                    type="url"
                                                    className="premium-input"
                                                    placeholder="https://drive.google.com/..."
                                                    value={resumeUrl}
                                                    onChange={(e) => setResumeUrl(e.target.value)}
                                                />
                                            </div>

                                            <div className="divider-text">OR</div>

                                            <div className="upload-box-compact" onClick={() => document.getElementById('resume-file').click()}>
                                                <FaBriefcase className="upload-icon-small" />
                                                <span>Click to upload PDF or DOCX</span>
                                                <input
                                                    type="file"
                                                    id="resume-file"
                                                    hidden
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={handleFileChange}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="selected-file-box">
                                            <div className="file-info">
                                                <FaBriefcase className="file-icon" />
                                                <span className="file-name">{resumeFile.name}</span>
                                            </div>
                                            <button
                                                type="button"
                                                className="remove-file-btn"
                                                onClick={() => { setResumeFile(null); setResumeUrl(''); }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}

                                    <div className="modal-actions-compact">
                                        <button
                                            type="button"
                                            className="cancel-btn-compact"
                                            onClick={() => setShowApplyModal(false)}
                                            disabled={applyLoading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="submit-btn-compact"
                                            disabled={applyLoading}
                                        >
                                            {applyLoading ? 'Sending...' : 'Submit Application'}
                                        </button>
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
                        <button
                            className={`save-btn ${isSaved ? 'active' : ''}`}
                            onClick={handleToggleSave}
                            disabled={saveLoading}
                            aria-label={isSaved ? 'Unsave job' : 'Save job'}
                        >
                            {isSaved ? (
                                <IoBookmark size={24} />
                            ) : (
                                <IoBookmarkOutline size={24} />
                            )}
                        </button>
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

                        {job.responsibilities && job.responsibilities.length > 0 && (
                            <>
                                <div className="section-title">Key Responsibilities</div>
                                <ul className="requirements-list">
                                    {job.responsibilities.map((res, index) => (
                                        <li key={index}>{res}</li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {job.requirements && job.requirements.length > 0 && (
                            <>
                                <div className="section-title">Requirements & Qualifications</div>
                                <ul className="requirements-list">
                                    {job.requirements.map((req, index) => (
                                        <li key={index}>{req}</li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {job.skills && job.skills.length > 0 && (
                            <>
                                <div className="section-title">Required Skills</div>
                                <div className="skills-container-details">
                                    {job.skills.map((skill, index) => (
                                        <span key={index} className="skill-pill-details">{skill}</span>
                                    ))}
                                </div>
                            </>
                        )}

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
        </div >
    );
};

export default JobDetails;
