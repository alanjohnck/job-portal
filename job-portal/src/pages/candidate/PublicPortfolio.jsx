import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaEnvelope, FaGithub, FaLinkedin, FaGlobe, FaCertificate } from 'react-icons/fa';
import { getPublicCandidateProfile } from '../../services/api';
import './PublicPortfolio.css';

const PublicPortfolio = () => {
    const { candidateId } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                const response = await getPublicCandidateProfile(candidateId);
                if (response.success && response.data) {
                    const profileData = response.data;
                    // Map projects to match UI expectations
                    if (profileData.projects) {
                        profileData.projects = profileData.projects.map(p => ({
                            id: p.id,
                            name: p.name,
                            desc: p.description,
                            tags: p.technologies ? (Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies) : '',
                            website: p.projectUrl,
                            sourceCode: p.repoUrl,
                            image: p.imageUrl
                        }));
                    }
                    setProfile(profileData);
                } else {
                    setError('Profile not found');
                }
            } catch (err) {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        if (candidateId) loadProfile();
    }, [candidateId]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    if (loading) return <div className="portfolio-loading">Loading Portfolio...</div>;
    if (error) return <div className="portfolio-error">{error}</div>;
    if (!profile) return null;

    // Helper to format skills which might be a string list or array
    const getSkills = () => {
        if (!profile.skills) return [];
        if (Array.isArray(profile.skills)) return profile.skills;
        return profile.skills.split(',').map(s => s.trim()).filter(s => s);
    };

    const skills = getSkills();

    // Map profile data to match the UI structure
    // Note: Projects and Hackathons are not currently in the backend model, 
    // so we check if they exist (in case model is updated later)

    return (
        <div className="public-portfolio-page">
            <div className="portfolio-preview-view">
                <div className="">
                    <header className="p-header">
                        <div className="p-pic-box">
                            <img src={profile.profilePicture || 'https://via.placeholder.com/150'} alt={profile.firstName} />
                        </div>
                        <h1 className="p-name">{profile.firstName} {profile.lastName}</h1>
                        <p className="p-role">{profile.currentJobTitle || 'Open to Opportunities'}</p>
                        <p className="p-bio">{profile.bio || 'No professional bio provided.'}</p>

                        <div className="p-social-icons">
                            {profile.email && <a href={`mailto:${profile.email}`} title="Email"><FaEnvelope /></a>}
                            {profile.githubUrl && <a href={profile.githubUrl.startsWith('http') ? profile.githubUrl : `https://${profile.githubUrl}`} target="_blank" rel="noopener noreferrer" title="GitHub"><FaGithub /></a>}
                            {profile.linkedInUrl && <a href={profile.linkedInUrl.startsWith('http') ? profile.linkedInUrl : `https://${profile.linkedInUrl}`} target="_blank" rel="noopener noreferrer" title="LinkedIn"><FaLinkedin /></a>}
                            {profile.portfolioUrl && <a href={profile.portfolioUrl.startsWith('http') ? profile.portfolioUrl : `https://${profile.portfolioUrl}`} target="_blank" rel="noopener noreferrer" title="Portfolio"><FaGlobe /></a>}
                        </div>

                        <div className="p-skills">
                            {skills.map((s, idx) => (
                                <span className="p-skill-pill" key={idx}>{s}</span>
                            ))}
                        </div>
                    </header>

                    <div className="p-content-grid">

                        {/* Work Experience */}
                        <section className="p-section">
                            <h2 className="p-sec-title">Work Experience</h2>
                            {profile.workExperiences && profile.workExperiences.length > 0 ? (
                                <div className="p-exp-list-premium">
                                    {profile.workExperiences.map(exp => (
                                        <div key={exp.id} className="p-exp-item-new">
                                            <div className="p-exp-logo">
                                                {exp.companyName ? exp.companyName.charAt(0) : 'W'}
                                            </div>
                                            <div className="p-exp-content">
                                                <div className="p-exp-header-row">
                                                    <h4>{exp.companyName}</h4>
                                                    <span className="p-exp-date-new">
                                                        {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}
                                                    </span>
                                                </div>
                                                <p className="p-exp-role-new">{exp.jobTitle}</p>
                                                <p className="p-exp-desc-new">{exp.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: '#718096' }}>No work experience listed.</p>
                            )}
                        </section>

                        {/* Hackathons - Render only if data exists (backend support needed) */}
                        {profile.hackathons && profile.hackathons.length > 0 && (
                            <section className="p-section">
                                <h2 className="p-sec-title">Hackathons</h2>
                                <div className="p-hack-timeline">
                                    {profile.hackathons.map((h, index) => (
                                        <div key={h.id} className="p-hack-node">
                                            <div className="p-node-indicator">
                                                <div className="p-node-circle">{h.name ? h.name.charAt(0) : 'H'}</div>
                                                {index !== profile.hackathons.length - 1 && <div className="p-node-line"></div>}
                                            </div>
                                            <div className="p-node-content">
                                                <span className="p-node-date">{h.date}</span>
                                                <h4>{h.name}</h4>
                                                <p className="p-node-location">{h.location}</p>
                                                <p className="p-node-desc">{h.desc}</p>
                                                {h.achievement && <span className="p-node-badge">{h.achievement}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        <section className="p-section">
                            <h2 className="p-sec-title">Education</h2>
                            {profile.educations && profile.educations.length > 0 ? (
                                <div className="p-edu-list-premium">
                                    {profile.educations.map(edu => (
                                        <div key={edu.id} className="p-edu-item-new">
                                            <div className="p-edu-dot"></div>
                                            <div className="p-edu-detail">
                                                <div className="p-edu-header-row">
                                                    <h4>{edu.institutionName}</h4>
                                                    <span className="p-edu-date-new">
                                                        {formatDate(edu.startDate)} - {edu.isCurrentlyStudying ? 'Present' : formatDate(edu.endDate)}
                                                    </span>
                                                </div>
                                                <p className="p-edu-degree-new">{edu.degree}</p>
                                                {edu.fieldOfStudy && <p style={{ color: '#718096', fontSize: '14px', margin: '4px 0 0 0' }}>{edu.fieldOfStudy}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: '#718096' }}>No education details listed.</p>
                            )}
                        </section>

                        {/* Certifications (Added as it is in backend even if not in screenshot) */}
                        {profile.certifications && profile.certifications.length > 0 && (
                            <section className="p-section">
                                <h2 className="p-sec-title">Certifications</h2>
                                <div className="p-edu-list-premium">
                                    {profile.certifications.map(cert => (
                                        <div key={cert.id} className="p-edu-item-new">
                                            <div className="p-edu-dot" style={{ background: '#48bb78' }}></div>
                                            <div className="p-edu-detail">
                                                <div className="p-edu-header-row">
                                                    <h4>{cert.name}</h4>
                                                    {cert.issueDate && <span className="p-edu-date-new">{formatDate(cert.issueDate)}</span>}
                                                </div>
                                                <p className="p-edu-degree-new" style={{ color: '#48bb78' }}>
                                                    {cert.issuingOrganization}
                                                </p>
                                                {cert.credentialUrl && (
                                                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#4299e1', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                                                        <FaCertificate /> View Credential
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Projects - Render only if data exists */}
                        {profile.projects && profile.projects.length > 0 && (
                            <section className="p-section">
                                <h2 className="p-sec-title">Key Projects</h2>
                                <div className="p-projects-modern-grid">
                                    {profile.projects.map(proj => (
                                        <div key={proj.id} className="p-proj-card-new">
                                            <div className="p-proj-img-box">
                                                {proj.image ? <img src={proj.image} alt="" /> : <div className="p-proj-placeholder">Project Image</div>}
                                            </div>
                                            <div className="p-proj-info">
                                                <h4>{proj.name}</h4>
                                                <p>{proj.desc}</p>
                                                <div className="p-proj-tags-new">
                                                    {proj.tags && proj.tags.split(',').map((t, i) => t.trim() && <span key={i}>{t.trim()}</span>)}
                                                </div>
                                                <div className="p-proj-links">
                                                    {proj.website && <span onClick={() => window.open(proj.website, '_blank')}><FaGlobe /> Website</span>}
                                                    {proj.sourceCode && <span onClick={() => window.open(proj.sourceCode, '_blank')}><FaGithub /> Source Code</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicPortfolio;
