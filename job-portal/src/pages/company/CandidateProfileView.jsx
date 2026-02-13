import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaChevronRight, FaDownload, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaLink, FaBriefcase, FaGraduationCap, FaCertificate } from 'react-icons/fa';
import CompanyNavbar from './components/CompanyNavbar';
import CompanySidebar from './components/CompanySidebar';
import { getPublicCandidateProfile } from '../../services/api';
import './CandidateProfileView.css';

const CandidateProfileView = () => {
    const { candidateId } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await getPublicCandidateProfile(candidateId);
                if (response.success && response.data) {
                    setProfile(response.data);
                } else {
                    setError(response.message || 'Profile not found');
                }
            } catch (err) {
                setError('Failed to load profile. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (candidateId) {
            loadProfile();
        } else {
            setError('Candidate id is missing');
            setLoading(false);
        }
    }, [candidateId]);

    const formatMonthYear = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return '';
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const formatRange = (start, end, isCurrent) => {
        const startText = formatMonthYear(start) || 'N/A';
        const endText = isCurrent ? 'Present' : (formatMonthYear(end) || 'N/A');
        return `${startText} - ${endText}`;
    };

    return (
        <div className="comp-layout candidate-profile-page">
            <CompanyNavbar />
            <div className="comp-container">
                <div className="container comp-flex">
                    <CompanySidebar />

                    <main className="comp-main-content">
                        <nav className="breadcrumb">
                            <span onClick={() => navigate('/company/dashboard')} style={{ cursor: 'pointer' }}>Home</span> <FaChevronRight size={10} />
                            <span onClick={() => navigate('/company/my-jobs')} style={{ cursor: 'pointer' }}>Jobs</span> <FaChevronRight size={10} />
                            <span className="active">Candidate Profile</span>
                        </nav>

                        {loading && <div className="loading-message">Loading profile...</div>}
                        {error && !loading && <div className="error-message">{error}</div>}

                        {!loading && !error && profile && (
                            <div className="profile-view-wrapper">
                                <div className="profile-hero-card">
                                    <div className="profile-hero-left">
                                        <div className="profile-avatar">
                                            {profile.profilePicture ? (
                                                <img src={profile.profilePicture} alt={profile.firstName} />
                                            ) : (
                                                <span>{`${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`}</span>
                                            )}
                                        </div>
                                        <div className="profile-hero-text">
                                            <h1>{`${profile.firstName} ${profile.lastName}`.trim()}</h1>
                                            <p className="profile-role">{profile.currentJobTitle || 'Candidate'}</p>
                                            <div className="profile-location">
                                                <FaMapMarkerAlt /> {profile.currentLocation || 'Location not provided'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="profile-hero-actions">
                                        <button
                                            className="outline-btn"
                                            onClick={() => profile.resumeUrl && window.open(profile.resumeUrl, '_blank')}
                                            disabled={!profile.resumeUrl}
                                        >
                                            <FaDownload /> {profile.resumeUrl ? 'Download Resume' : 'Resume Unavailable'}
                                        </button>
                                    </div>
                                </div>

                                <div className="profile-section-grid">
                                    <section className="profile-section-card">
                                        <h2>About</h2>
                                        <p>{profile.bio || 'No bio added yet.'}</p>
                                        <div className="contact-grid">
                                            <div className="contact-item">
                                                <FaEnvelope /> {profile.email || 'Email not provided'}
                                            </div>
                                            <div className="contact-item">
                                                <FaPhoneAlt /> {profile.phoneNumber || 'Phone not provided'}
                                            </div>
                                            <div className="contact-item">
                                                <FaLink /> {profile.portfolioUrl || 'Portfolio not provided'}
                                            </div>
                                        </div>
                                    </section>

                                    <section className="profile-section-card">
                                        <h2>Skills</h2>
                                        {profile.skills && profile.skills.length > 0 ? (
                                            <div className="skills-list">
                                                {profile.skills.map((skill) => (
                                                    <span key={skill} className="skill-pill">{skill}</span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p>No skills listed.</p>
                                        )}
                                    </section>
                                </div>

                                <section className="profile-section-card">
                                    <h2><FaBriefcase /> Experience</h2>
                                    {profile.workExperiences && profile.workExperiences.length > 0 ? (
                                        <div className="timeline-list">
                                            {profile.workExperiences.map((exp) => (
                                                <div key={exp.id} className="timeline-item">
                                                    <div className="timeline-heading">
                                                        <h3>{exp.jobTitle || 'Role'} · {exp.companyName || 'Company'}</h3>
                                                        <span>{formatRange(exp.startDate, exp.endDate, exp.isCurrentJob)}</span>
                                                    </div>
                                                    <p>{exp.description || 'No description provided.'}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No experience added.</p>
                                    )}
                                </section>

                                <section className="profile-section-card">
                                    <h2><FaGraduationCap /> Education</h2>
                                    {profile.educations && profile.educations.length > 0 ? (
                                        <div className="timeline-list">
                                            {profile.educations.map((edu) => (
                                                <div key={edu.id} className="timeline-item">
                                                    <div className="timeline-heading">
                                                        <h3>{edu.degree || 'Degree'} · {edu.institutionName || 'Institution'}</h3>
                                                        <span>{formatRange(edu.startDate, edu.endDate, edu.isCurrentlyStudying)}</span>
                                                    </div>
                                                    <p>{edu.fieldOfStudy || 'Field of study not provided.'}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No education details added.</p>
                                    )}
                                </section>

                                <section className="profile-section-card">
                                    <h2><FaCertificate /> Certifications</h2>
                                    {profile.certifications && profile.certifications.length > 0 ? (
                                        <div className="cert-list">
                                            {profile.certifications.map((cert) => (
                                                <div key={cert.id} className="cert-item">
                                                    <h3>{cert.name || 'Certification'}</h3>
                                                    <p>{cert.issuingOrganization || 'Issuing organization not provided.'}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No certifications added.</p>
                                    )}
                                </section>
                            </div>
                        )}

                        <footer className="comp-footer-minimal">
                            <p>© 2021 Jobpilot - Job Board. All rights Reserved</p>
                        </footer>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default CandidateProfileView;
