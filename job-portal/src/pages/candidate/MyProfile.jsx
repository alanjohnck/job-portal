import React, { useState, useEffect } from 'react';
import './MyProfile.css';
import Header from './components/Header';
import {
    FaPlus, FaTrash, FaDownload, FaEye, FaEdit,
    FaLinkedin, FaGithub, FaEnvelope, FaGlobe,
    FaGraduationCap, FaBriefcase, FaCode, FaTrophy,
    FaArrowLeft, FaLink, FaUserCircle, FaMapMarkerAlt, FaPhoneAlt, FaSave
} from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';
import {
    getCandidateProfile,
    updateCandidateProfile,
    updateProfilePicture,
    updateResume,
    deleteResume,
    getWorkExperiences,
    createWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
    getEducations,
    createEducation,
    updateEducation,
    deleteEducation,
    getCertifications,
    createCertification,
    updateCertification,
    deleteCertification,
    updateSkills
} from '../../services/api';

const MyProfile = () => {
    const [editMode, setEditMode] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [candidateId, setCandidateId] = useState(null);
    const [profileData, setProfileData] = useState({
        name: 'James Joseph K',
        role: 'Full Stack Developer',
        bio: 'Aspiring software developer with expertise in various programming languages and technologies, focused on creating impactful applications and systems. Experienced in both backend and frontend development, with strong interest in cloud computing, Al, and cybersecurity.',
        profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        email: 'jamesjosephk@gmail.com',
        phone: '+91 9876543210',
        location: 'Kochi, India',
        linkedinLink: 'linkedin.com/in/jamesjosephk',
        githubLink: 'github.com/jamesjosephk',
        website: 'jamesjosephk.dev',
        skills: 'C, C++, Java, Python, JavaScript, React.js, Next.js, Flutter, MongoDB, Firebase, SQL, Git',
        education: [
            { id: 1, school: 'Govt. Model Engineering College, Kochi', degree: 'B.Tech in Computer Science', period: '2021 - 2025' }
        ],
        experience: [
            {
                id: 2,
                company: 'Ragas',
                role: 'Full-stack developer',
                period: 'October 2024 - December 2024',
                desc: 'Developed the MVP with a complex dashboard to enhance user workflows.'
            }
        ],
        projects: [
            {
                id: 3,
                name: 'FinTrack',
                desc: 'Created a personalized finance tracking app that helps in keeping track of daily expenses using React, Node.js, and MongoDB.',
                tags: 'React, Node.js, MongoDB',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop'
            }
        ],
        hackathons: [
            {
                id: 4,
                name: 'GenAI Rush 2023',
                location: 'Bengaluru',
                achievement: '1st position',
                date: '30th July 2023',
                desc: 'All India Hackathon for students and professionals where we secured 1st position.'
            }
        ],
        certifications: [
            { id: 5, name: 'Google Analytics Certified' },
            { id: 6, name: 'Facebook Blueprint Certification' }
        ]
    });

    // Load profile data on mount
    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            console.log('========== PROFILE LOAD START ==========');
            console.log('[Auth] Token exists:', !!token);
            console.log('[Auth] Token preview:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
            console.log('[Environment] API URL:', import.meta.env.VITE_API_URL);
            console.log('Loading candidate profile data...');
            
            // Fetch profile data
            const profileResult = await getCandidateProfile();
            console.log('[API] Profile response:', JSON.stringify(profileResult, null, 2));
            
            if (profileResult.success && profileResult.data) {
                const profile = profileResult.data;
                const id = profile.candidateId || profile.id;
                setCandidateId(id);
                console.log('[Profile] Loaded - ID:', id);
                console.log('[Profile] Name:', profile.fullName);
                console.log('[Profile] Email:', profile.email);
                
                // Fetch work experiences
                const expResult = await getWorkExperiences();
                console.log('[API] Work Experiences response:', JSON.stringify(expResult, null, 2));
                const experiences = expResult.success && expResult.data ? expResult.data : [];
                console.log('[Profile] Loaded', experiences.length, 'work experiences');
                
                // Fetch educations
                const eduResult = await getEducations();
                console.log('[API] Educations response:', JSON.stringify(eduResult, null, 2));
                const educations = eduResult.success && eduResult.data ? eduResult.data : [];
                console.log('[Profile] Loaded', educations.length, 'educations');
                
                // Fetch certifications
                const certResult = await getCertifications();
                console.log('[API] Certifications response:', JSON.stringify(certResult, null, 2));
                const certifications = certResult.success && certResult.data ? certResult.data : [];
                console.log('[Profile] Loaded', certifications.length, 'certifications');
                
                setProfileData(prev => ({
                    ...prev,
                    name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || prev.name,
                    role: profile.currentJobTitle || prev.role,
                    bio: profile.bio || prev.bio,
                    profilePic: profile.profilePicture || prev.profilePic,
                    email: profile.email || prev.email,
                    phone: profile.phoneNumber || prev.phone,
                    location: profile.currentLocation || prev.location,
                    linkedinLink: profile.linkedInUrl || prev.linkedinLink,
                    githubLink: profile.githubUrl || prev.githubLink,
                    website: profile.portfolioUrl || prev.website,
                    skills: (profile.skills && profile.skills.length > 0) ? profile.skills.join(', ') : prev.skills,
                    experience: experiences.length > 0 ? experiences.map(exp => ({
                        id: exp.id,
                        company: exp.companyName || '',
                        role: exp.jobTitle || '',
                        period: `${formatDate(exp.startDate)} - ${exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}`,
                        desc: exp.description || '',
                        achievements: exp.achievements || [],
                        technologies: exp.technologiesUsed || []
                    })) : prev.experience,
                    education: educations.length > 0 ? educations.map(edu => ({
                        id: edu.id,
                        school: edu.institutionName || '',
                        degree: edu.degree || '',
                        fieldOfStudy: edu.fieldOfStudy || '',
                        grade: edu.grade || '',
                        period: `${formatDate(edu.startDate)} - ${edu.isCurrentlyStudying ? 'Present' : formatDate(edu.endDate)}`
                    })) : prev.education,
                    certifications: certifications.length > 0 ? certifications.map(cert => ({
                        id: cert.id,
                        name: cert.name || '',
                        issuingOrganization: cert.issuingOrganization || '',
                        credentialId: cert.credentialId || '',
                        credentialUrl: cert.credentialUrl || ''
                    })) : prev.certifications
                }));
                
                console.log('[Profile] ✅ Data populated successfully!');
            } else {
                console.warn('[Profile] ⚠️ API returned no data:', profileResult);
                setError(`Unable to load profile: ${profileResult.message || 'No data returned from server'}`);
            }
        } catch (err) {
            console.error('[Profile] ❌ Error loading profile:', err);
            setError(`Failed to load profile: ${err.message}. Check console for details.`);
            // Keep default data if fetch fails
        } finally {
            setLoading(false);
            console.log('[Profile] Loading complete');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            setError(null);
            
            // Split name into first and last
            const nameParts = profileData.name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            // Update basic profile
            await updateCandidateProfile({
                firstName: firstName,
                lastName: lastName,
                currentJobTitle: profileData.role,
                bio: profileData.bio,
                phoneNumber: profileData.phone,
                currentLocation: profileData.location,
                linkedInUrl: profileData.linkedinLink,
                githubUrl: profileData.githubLink,
                portfolioUrl: profileData.website,
                profilePicture: profileData.profilePic,
                skills: profileData.skills.split(',').map(s => s.trim()).filter(s => s)
            });
            
            // Update skills
            const skillsArray = profileData.skills.split(',').map(s => s.trim()).filter(s => s);
            await updateSkills(skillsArray);
            
            alert('Profile saved successfully!');
            await loadProfileData(); // Reload to show updated data
        } catch (err) {
            setError(err.message || 'Failed to save profile');
            console.error('Error saving profile:', err);
            alert('Failed to save profile: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDownloadPDF = () => {
        window.print();
    };

    // Work Experience Handlers
    const handleAddExperience = async () => {
        const newExp = {
            id: Date.now(),
            company: '',
            role: '',
            period: '',
            desc: ''
        };
        setProfileData(prev => ({
            ...prev,
            experience: [...prev.experience, newExp]
        }));
    };

    const handleUpdateExperience = async (id, field, value) => {
        setProfileData(prev => ({
            ...prev,
            experience: prev.experience.map(item => 
                item.id === id ? { ...item, [field]: value } : item
            )
        }));
    };

    const handleDeleteExperience = async (id) => {
        try {
            // If it's a new item (temp ID), just remove from state
            if (typeof id === 'number') {
                setProfileData(prev => ({
                    ...prev,
                    experience: prev.experience.filter(item => item.id !== id)
                }));
                return;
            }
            
            // Otherwise delete from API
            await deleteWorkExperience(id);
            setProfileData(prev => ({
                ...prev,
                experience: prev.experience.filter(item => item.id !== id)
            }));
            alert('Experience deleted successfully!');
        } catch (err) {
            alert('Failed to delete experience: ' + err.message);
        }
    };

    const handleSaveExperience = async (exp) => {
        try {
            // Parse dates from period string
            const [startStr, endStr] = exp.period.split('-').map(s => s.trim());
            const isCurrentJob = endStr.toLowerCase() === 'present';
            
            const expData = {
                jobTitle: exp.role,
                companyName: exp.company,
                employmentType: 'Full-time',
                location: '',
                startDate: new Date(startStr).toISOString(),
                endDate: isCurrentJob ? null : new Date(endStr).toISOString(),
                isCurrentJob,
                description: exp.desc,
                achievements: exp.achievements || [],
                technologies: exp.technologies || []
            };
            
            if (typeof exp.id === 'number') {
                // Create new
                const result = await createWorkExperience(expData);
                if (result.success) {
                    // Update with real ID
                    setProfileData(prev => ({
                        ...prev,
                        experience: prev.experience.map(item => 
                            item.id === exp.id ? { ...item, id: result.data.id } : item
                        )
                    }));
                    alert('Experience added successfully!');
                }
            } else {
                // Update existing
                await updateWorkExperience(exp.id, expData);
                alert('Experience updated successfully!');
            }
        } catch (err) {
            alert('Failed to save experience: ' + err.message);
        }
    };

    // Education Handlers
    const handleAddEducation = () => {
        const newEdu = {
            id: Date.now(),
            school: '',
            degree: '',
            period: ''
        };
        setProfileData(prev => ({
            ...prev,
            education: [...prev.education, newEdu]
        }));
    };

    const handleUpdateEducation = (id, field, value) => {
        setProfileData(prev => ({
            ...prev,
            education: prev.education.map(item => 
                item.id === id ? { ...item, [field]: value } : item
            )
        }));
    };

    const handleDeleteEducation = async (id) => {
        try {
            if (typeof id === 'number') {
                setProfileData(prev => ({
                    ...prev,
                    education: prev.education.filter(item => item.id !== id)
                }));
                return;
            }
            
            await deleteEducation(id);
            setProfileData(prev => ({
                ...prev,
                education: prev.education.filter(item => item.id !== id)
            }));
            alert('Education deleted successfully!');
        } catch (err) {
            alert('Failed to delete education: ' + err.message);
        }
    };

    const handleSaveEducation = async (edu) => {
        try {
            const [startStr, endStr] = edu.period.split('-').map(s => s.trim());
            const isCurrentlyStudying = endStr.toLowerCase() === 'present';
            
            const eduData = {
                institutionName: edu.school,
                degree: edu.degree,
                fieldOfStudy: edu.fieldOfStudy || '',
                startDate: new Date(startStr).toISOString(),
                endDate: isCurrentlyStudying ? null : new Date(endStr).toISOString(),
                isCurrentlyStudying,
                grade: edu.grade || ''
            };
            
            if (typeof edu.id === 'number') {
                const result = await createEducation(eduData);
                if (result.success) {
                    setProfileData(prev => ({
                        ...prev,
                        education: prev.education.map(item => 
                            item.id === edu.id ? { ...item, id: result.data.id } : item
                        )
                    }));
                    alert('Education added successfully!');
                }
            } else {
                await updateEducation(edu.id, eduData);
                alert('Education updated successfully!');
            }
        } catch (err) {
            alert('Failed to save education: ' + err.message);
        }
    };

    // Certification Handlers
    const handleAddCertification = () => {
        const newCert = {
            id: Date.now(),
            name: ''
        };
        setProfileData(prev => ({
            ...prev,
            certifications: [...prev.certifications, newCert]
        }));
    };

    const handleUpdateCertification = (id, field, value) => {
        setProfileData(prev => ({
            ...prev,
            certifications: prev.certifications.map(item => 
                item.id === id ? { ...item, [field]: value } : item
            )
        }));
    };

    const handleDeleteCertification = async (id) => {
        try {
            if (typeof id === 'number') {
                setProfileData(prev => ({
                    ...prev,
                    certifications: prev.certifications.filter(item => item.id !== id)
                }));
                return;
            }
            
            await deleteCertification(id);
            setProfileData(prev => ({
                ...prev,
                certifications: prev.certifications.filter(item => item.id !== id)
            }));
            alert('Certification deleted successfully!');
        } catch (err) {
            alert('Failed to delete certification: ' + err.message);
        }
    };

    const handleSaveCertification = async (cert) => {
        try {
            const certData = {
                name: cert.name,
                issuingOrganization: cert.issuingOrganization || '',
                issueDate: cert.issueDate ? new Date(cert.issueDate).toISOString() : new Date().toISOString(),
                expiryDate: cert.expiryDate ? new Date(cert.expiryDate).toISOString() : null,
                credentialId: cert.credentialId || '',
                credentialUrl: cert.credentialUrl || ''
            };
            
            if (typeof cert.id === 'number') {
                const result = await createCertification(certData);
                if (result.success) {
                    setProfileData(prev => ({
                        ...prev,
                        certifications: prev.certifications.map(item => 
                            item.id === cert.id ? { ...item, id: result.data.id } : item
                        )
                    }));
                    alert('Certification added successfully!');
                }
            } else {
                await updateCertification(cert.id, certData);
                alert('Certification updated successfully!');
            }
        } catch (err) {
            alert('Failed to save certification: ' + err.message);
        }
    };

    // Correct Item Handlers
    const addItem = (section, emptyObj) => {
        setProfileData(prev => ({
            ...prev,
            [section]: [...prev[section], { ...emptyObj, id: Date.now() }]
        }));
    };

    const removeItem = (section, id) => {
        setProfileData(prev => ({
            ...prev,
            [section]: prev[section].filter(item => item.id !== id)
        }));
    };

    const updateItem = (section, id, field, value) => {
        setProfileData(prev => ({
            ...prev,
            [section]: prev[section].map(item => item.id === id ? { ...item, [field]: value } : item)
        }));
    };

    return (
        <div className="profile-builder-page">
            <Header />

            {loading && (
                <div style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    backgroundColor: 'rgba(0,0,0,0.5)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    zIndex: 9999 
                }}>
                    <div style={{ 
                        backgroundColor: 'white', 
                        padding: '30px', 
                        borderRadius: '10px', 
                        textAlign: 'center' 
                    }}>
                        <div style={{ fontSize: '18px', marginBottom: '10px' }}>Loading Profile...</div>
                        <div style={{ fontSize: '40px', animation: 'spin 1s linear infinite' }}>⏳</div>
                    </div>
                </div>
            )}

            {error && (
                <div style={{ 
                    backgroundColor: '#fee', 
                    color: '#c33', 
                    padding: '15px', 
                    margin: '20px', 
                    borderRadius: '8px',
                    border: '1px solid #fcc'
                }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {candidateId && !loading && (
                <div style={{ 
                    backgroundColor: '#e0f7fa', 
                    color: '#006064', 
                    padding: '8px 20px', 
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: '500'
                }}>
                    Candidate ID: {candidateId}
                </div>
            )}

            <div className="builder-toolbar no-print">
                <div className="container">
                    <div className="toolbar-inner">
                        <div className="toolbar-left">
                            <button className="back-dash-btn" onClick={() => window.location.href = '/candidate/dashboard'}>
                                <FaArrowLeft /> Dashboard
                            </button>
                            <div className="view-toggle">
                                <button className={`mode-btn ${editMode ? 'active' : ''}`} onClick={() => setEditMode(true)}>
                                    <FaEdit /> Build Form
                                </button>
                                <button className={`mode-btn ${!editMode ? 'active' : ''}`} onClick={() => setEditMode(false)}>
                                    <FaEye /> Live Preview
                                </button>
                            </div>
                        </div>
                        <div className="spacer"></div>
                        <button className="download-btn-premium" onClick={handleSaveProfile} disabled={saving} style={{marginRight: '10px', backgroundColor: '#10b981'}}>
                            <FaSave /> {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                        <button className="download-btn-premium" onClick={handleDownloadPDF}>
                            <FaDownload /> Download ATS PDF
                        </button>
                    </div>
                </div>
            </div>

            <main className="container builder-main">
                <div className={`builder-layout ${!editMode ? 'preview-only' : ''}`}>
                    {/* EDIT PANEL */}
                    {editMode && (
                        <aside className="edit-panel-scroll no-print">
                            <div className="panel-card">
                                <h2 className="panel-main-title">Profile Information</h2>

                                <section className="form-section">
                                    <h3 className="form-section-title"><FaUserCircle /> Personal Details</h3>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Full Name</label>
                                            <input type="text" className="full-style-input" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label>Profile Image URL</label>
                                            <input type="text" className="full-style-input" value={profileData.profilePic} onChange={(e) => setProfileData({ ...profileData, profilePic: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label>Headline / Role</label>
                                            <input type="text" className="full-style-input" value={profileData.role} onChange={(e) => setProfileData({ ...profileData, role: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label>Professional Bio</label>
                                            <textarea rows="3" className="full-style-input" value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Email</label>
                                                <input type="email" className="full-style-input" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
                                            </div>
                                            <div className="form-group">
                                                <label>Phone</label>
                                                <input type="text" className="full-style-input" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Location</label>
                                            <input type="text" className="full-style-input" value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>LinkedIn</label>
                                                <input type="text" className="full-style-input" value={profileData.linkedinLink} onChange={(e) => setProfileData({ ...profileData, linkedinLink: e.target.value })} />
                                            </div>
                                            <div className="form-group">
                                                <label>GitHub</label>
                                                <input type="text" className="full-style-input" value={profileData.githubLink} onChange={(e) => setProfileData({ ...profileData, githubLink: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Skills (Comma separated)</label>
                                            <input type="text" className="full-style-input" value={profileData.skills} onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })} />
                                        </div>
                                    </div>
                                </section>

                                <section className="form-section">
                                    <div className="section-header">
                                        <h3 className="form-section-title"><FaTrophy /> Hackathons</h3>
                                        <button className="add-btn-small" onClick={() => addItem('hackathons', { name: '', location: '', achievement: '', date: '' })}>
                                            <FaPlus /> Add
                                        </button>
                                    </div>
                                    {profileData.hackathons && profileData.hackathons.map(h => (
                                        <div key={h.id} className="form-item-card">
                                            <div className="item-action-bar">
                                                <span className="item-label">Hackathon Entry</span>
                                                <FaTrash className="item-delete-icon" onClick={() => removeItem('hackathons', h.id)} />
                                            </div>
                                            <div className="item-inputs">
                                                <input className="full-style-input" placeholder="Name" value={h.name} onChange={(e) => updateItem('hackathons', h.id, 'name', e.target.value)} />
                                                <input className="full-style-input" placeholder="Location" value={h.location} onChange={(e) => updateItem('hackathons', h.id, 'location', e.target.value)} />
                                                <textarea className="full-style-input" placeholder="Description/Achivements" value={h.desc} onChange={(e) => updateItem('hackathons', h.id, 'desc', e.target.value)} />
                                                <input className="full-style-input" placeholder="Achievement Badge" value={h.achievement} onChange={(e) => updateItem('hackathons', h.id, 'achievement', e.target.value)} />
                                                <input className="full-style-input" placeholder="Date" value={h.date} onChange={(e) => updateItem('hackathons', h.id, 'date', e.target.value)} />
                                            </div>
                                        </div>
                                    ))}
                                </section>

                                <section className="form-section">
                                    <div className="section-header">
                                        <h3 className="form-section-title"><FaBriefcase /> Work Experience</h3>
                                        <button className="add-btn-small" onClick={handleAddExperience}>
                                            <FaPlus /> Add
                                        </button>
                                    </div>
                                    {profileData.experience.map(exp => (
                                        <div key={exp.id} className="form-item-card">
                                            <div className="item-action-bar">
                                                <span className="item-label">Experience Entry</span>
                                                <FaTrash className="item-delete-icon" onClick={() => handleDeleteExperience(exp.id)} />
                                            </div>
                                            <div className="item-inputs">
                                                <input className="full-style-input" placeholder="Company Name" value={exp.company} onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)} />
                                                <input className="full-style-input" placeholder="Your Role" value={exp.role} onChange={(e) => handleUpdateExperience(exp.id, 'role', e.target.value)} />
                                                <input className="full-style-input" placeholder="Period (e.g. Jan 2021 - Present)" value={exp.period} onChange={(e) => handleUpdateExperience(exp.id, 'period', e.target.value)} />
                                                <textarea className="full-style-input" placeholder="Job Description" value={exp.desc} onChange={(e) => handleUpdateExperience(exp.id, 'desc', e.target.value)} />
                                            </div>
                                        </div>
                                    ))}
                                </section>

                                <section className="form-section">
                                    <div className="section-header">
                                        <h3 className="form-section-title"><FaGraduationCap /> Education</h3>
                                        <button className="add-btn-small" onClick={handleAddEducation}>
                                            <FaPlus /> Add
                                        </button>
                                    </div>
                                    {profileData.education.map(edu => (
                                        <div key={edu.id} className="form-item-card">
                                            <div className="item-action-bar">
                                                <span className="item-label">Education Entry</span>
                                                <FaTrash className="item-delete-icon" onClick={() => handleDeleteEducation(edu.id)} />
                                            </div>
                                            <div className="item-inputs">
                                                <input className="full-style-input" placeholder="School/University" value={edu.school} onChange={(e) => handleUpdateEducation(edu.id, 'school', e.target.value)} />
                                                <input className="full-style-input" placeholder="Degree" value={edu.degree} onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)} />
                                                <input className="full-style-input" placeholder="Period (e.g. Sep 2021 - Present)" value={edu.period} onChange={(e) => handleUpdateEducation(edu.id, 'period', e.target.value)} />
                                            </div>
                                        </div>
                                    ))}
                                </section>

                                <section className="form-section">
                                    <div className="section-header">
                                        <h3 className="form-section-title"><FaTrophy /> Certifications</h3>
                                        <button className="add-btn-small" onClick={handleAddCertification}>
                                            <FaPlus /> Add
                                        </button>
                                    </div>
                                    {profileData.certifications && profileData.certifications.map(cert => (
                                        <div key={cert.id} className="form-item-card">
                                            <div className="item-action-bar">
                                                <span className="item-label">Certification</span>
                                                <FaTrash className="item-delete-icon" onClick={() => handleDeleteCertification(cert.id)} />
                                            </div>
                                            <div className="item-inputs">
                                                <input className="full-style-input" placeholder="Certification Name" value={cert.name} onChange={(e) => handleUpdateCertification(cert.id, 'name', e.target.value)} />
                                            </div>
                                        </div>
                                    ))}
                                </section>

                                <section className="form-section">
                                    <div className="section-header">
                                        <h3 className="form-section-title"><FaCode /> Key Projects</h3>
                                        <button className="add-btn-small" onClick={() => addItem('projects', { name: '', desc: '', tags: '' })}>
                                            <FaPlus /> Add
                                        </button>
                                    </div>
                                    {profileData.projects.map(proj => (
                                        <div key={proj.id} className="form-item-card">
                                            <div className="item-action-bar">
                                                <span className="item-label">Project Entry</span>
                                                <FaTrash className="item-delete-icon" onClick={() => removeItem('projects', proj.id)} />
                                            </div>
                                            <div className="item-inputs">
                                                <input className="full-style-input" placeholder="Project Name" value={proj.name} onChange={(e) => updateItem('projects', proj.id, 'name', e.target.value)} />
                                                <input className="full-style-input" placeholder="Project Image URL" value={proj.image} onChange={(e) => updateItem('projects', proj.id, 'image', e.target.value)} />
                                                <textarea className="full-style-input" placeholder="Description" value={proj.desc} onChange={(e) => updateItem('projects', proj.id, 'desc', e.target.value)} />
                                                <input className="full-style-input" placeholder="Technologies (Comma separated)" value={proj.tags} onChange={(e) => updateItem('projects', proj.id, 'tags', e.target.value)} />
                                            </div>
                                        </div>
                                    ))}
                                </section>
                            </div>
                        </aside>
                    )}

                    {/* PORTFOLIO PREVIEW */}
                    <div className="portfolio-preview-view no-print">
                        <div className="portfolio-inner">
                            <header className="p-header">
                                <div className="p-pic-box">
                                    <img src={profileData.profilePic} alt="" />
                                </div>
                                <h1 className="p-name">{profileData.name || 'Your Name'}</h1>
                                <p className="p-role">{profileData.role || 'Job Title'}</p>
                                <p className="p-bio">{profileData.bio || 'Professional summary summary summary...'}</p>

                                <div className="p-social-icons">
                                    <a href={`mailto:${profileData.email}`} title="Email"><FaEnvelope /></a>
                                    <a href={profileData.githubLink.startsWith('http') ? profileData.githubLink : `https://${profileData.githubLink}`} target="_blank" rel="noopener noreferrer" title="GitHub"><FaGithub /></a>
                                    <a href={profileData.linkedinLink.startsWith('http') ? profileData.linkedinLink : `https://${profileData.linkedinLink}`} target="_blank" rel="noopener noreferrer" title="LinkedIn"><FaLinkedin /></a>
                                </div>

                                <div className="p-skills">
                                    {profileData.skills.split(',').map((s, idx) => (
                                        s.trim() && <span className="p-skill-pill" key={idx}>{s.trim()}</span>
                                    ))}
                                </div>
                            </header>

                            <div className="p-content-grid">
                                <section className="p-section">
                                    <h2 className="p-sec-title">Work Experience</h2>
                                    <div className="p-exp-list-premium">
                                        {profileData.experience.map(exp => (
                                            <div key={exp.id} className="p-exp-item-new">
                                                <div className="p-exp-logo">
                                                    {exp.company ? exp.company.charAt(0) : 'W'}
                                                </div>
                                                <div className="p-exp-content">
                                                    <div className="p-exp-header-row">
                                                        <h4>{exp.company}</h4>
                                                        <span className="p-exp-date-new">{exp.period}</span>
                                                    </div>
                                                    <p className="p-exp-role-new">{exp.role}</p>
                                                    <p className="p-exp-desc-new">{exp.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="p-section">
                                    <h2 className="p-sec-title">Hackathons</h2>
                                    <div className="p-hack-timeline">
                                        {profileData.hackathons && profileData.hackathons.map((h, index) => (
                                            <div key={h.id} className="p-hack-node">
                                                <div className="p-node-indicator">
                                                    <div className="p-node-circle">{h.name ? h.name.charAt(0) : 'H'}</div>
                                                    {index !== profileData.hackathons.length - 1 && <div className="p-node-line"></div>}
                                                </div>
                                                <div className="p-node-content">
                                                    <span className="p-node-date">{h.date}</span>
                                                    <h4>{h.name}</h4>
                                                    <p className="p-node-location">{h.location}</p>
                                                    <p className="p-node-desc">{h.desc}</p>
                                                    <span className="p-node-badge">{h.achievement}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="p-section">
                                    <h2 className="p-sec-title">Education</h2>
                                    <div className="p-edu-list-premium">
                                        {profileData.education.map(edu => (
                                            <div key={edu.id} className="p-edu-item-new">
                                                <div className="p-edu-dot"></div>
                                                <div className="p-edu-detail">
                                                    <div className="p-edu-header-row">
                                                        <h4>{edu.school}</h4>
                                                        <span className="p-edu-date-new">{edu.period}</span>
                                                    </div>
                                                    <p className="p-edu-degree-new">{edu.degree}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="p-section">
                                    <h2 className="p-sec-title">Key Projects</h2>
                                    <div className="p-projects-modern-grid">
                                        {profileData.projects.map(proj => (
                                            <div key={proj.id} className="p-proj-card-new">
                                                <div className="p-proj-img-box">
                                                    {proj.image ? <img src={proj.image} alt="" /> : <div className="p-proj-placeholder">Project Image</div>}
                                                </div>
                                                <div className="p-proj-info">
                                                    <h4>{proj.name}</h4>
                                                    <p>{proj.desc}</p>
                                                    <div className="p-proj-tags-new">
                                                        {proj.tags.split(',').map((t, i) => t.trim() && <span key={i}>{t.trim()}</span>)}
                                                    </div>
                                                    <div className="p-proj-links">
                                                        <span><FaGlobe /> Website</span>
                                                        <span><FaGithub /> Source Code</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>

                    {/* HIDDEN ATS RESUME TEMPLATE (PRINT ONLY) */}
                    <div className="ats-resume-modern print-only">
                        <header className="ats-modern-header">
                            <h1>{profileData.name.toUpperCase()}</h1>
                            <p className="ats-headline-tagline">{profileData.role.toUpperCase()}</p>
                            <div className="ats-contact-row">
                                {profileData.location} | {profileData.email} | {profileData.phone} | {profileData.linkedinLink}
                            </div>
                        </header>

                        <section className="ats-modern-section">
                            <h3 className="ats-sec-title">PROFESSIONAL SUMMARY</h3>
                            <div className="ats-sec-line"></div>
                            <p className="ats-summary-text">{profileData.bio}</p>
                        </section>

                        <section className="ats-modern-section">
                            <h3 className="ats-sec-title">WORK EXPERIENCE</h3>
                            <div className="ats-sec-line"></div>
                            {profileData.experience.map(exp => (
                                <div key={exp.id} className="ats-exp-item">
                                    <div className="ats-exp-header">
                                        <div className="ats-job-info">
                                            <div className="ats-job-title">{exp.role}</div>
                                            <div className="ats-company-info">{exp.company}</div>
                                        </div>
                                        <div className="ats-job-date">{exp.period}</div>
                                    </div>
                                    <ul className="ats-bullets">
                                        {exp.desc.split('\n').map((line, i) => (
                                            line.trim() && <li key={i}>{line.trim()}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </section>

                        <section className="ats-modern-section">
                            <h3 className="ats-sec-title">EDUCATION</h3>
                            <div className="ats-sec-line"></div>
                            {profileData.education.map(edu => (
                                <div key={edu.id} className="ats-edu-item">
                                    <div className="ats-edu-header">
                                        <div className="ats-edu-degree">{edu.degree}</div>
                                        <div className="ats-edu-date">{edu.period}</div>
                                    </div>
                                    <div className="ats-edu-school">{edu.school}</div>
                                </div>
                            ))}
                        </section>

                        <section className="ats-modern-section">
                            <h3 className="ats-sec-title">KEY PROJECTS</h3>
                            <div className="ats-sec-line"></div>
                            {profileData.projects.map(proj => (
                                <div key={proj.id} className="ats-exp-item">
                                    <div className="ats-exp-header">
                                        <div className="ats-job-title">{proj.name}</div>
                                    </div>
                                    <ul className="ats-bullets">
                                        {proj.desc.split('\n').map((line, i) => (
                                            line.trim() && <li key={i}>{line.trim()}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </section>

                        <section className="ats-modern-section">
                            <h3 className="ats-sec-title">SKILLS</h3>
                            <div className="ats-sec-line"></div>
                            <div className="ats-skills-list">
                                <strong>Technical Skills:</strong> {profileData.skills}
                            </div>
                        </section>
                        <section className="ats-modern-section">
                            <h3 className="ats-sec-title">CERTIFICATIONS</h3>
                            <div className="ats-sec-line"></div>
                            <ul className="ats-bullets">
                                {profileData.certifications && profileData.certifications.map(cert => (
                                    <li key={cert.id}>{cert.name}</li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MyProfile;
