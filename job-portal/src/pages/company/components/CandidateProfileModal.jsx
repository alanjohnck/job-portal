import React from 'react';
import { FaTimes, FaRegBookmark, FaEnvelope, FaUserCheck, FaBriefcase, FaGraduationCap, FaFlag, FaCalendarAlt, FaUser, FaMars, FaGlobe, FaMapMarkerAlt, FaPhoneAlt, FaFacebookF, FaTwitter, FaLinkedinIn, FaRedditAlien, FaInstagram, FaYoutube, FaDownload } from 'react-icons/fa';
import './CandidateProfileModal.css';

const CandidateProfileModal = ({ isOpen, onClose, candidate }) => {
    if (!isOpen) return null;

    return (
        <div className="profile-modal-overlay">
            <div className="profile-modal-content">
                <button className="close-profile-modal" onClick={onClose}><FaTimes /></button>

                <div className="profile-modal-header">
                    <div className="header-left-info">
                        <div className="header-avatar">
                            <img src={candidate.image} alt={candidate.name} />
                        </div>
                        <div className="header-name-role">
                            <h2>{candidate.name}</h2>
                            <p>{candidate.role}</p>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="action-btn-outline"><FaRegBookmark /></button>
                        <button className="action-btn-outline"><FaEnvelope /> Send Mail</button>
                        <button className="action-btn-primary"><FaUserCheck /> Hire Candidates</button>
                    </div>
                </div>

                <div className="profile-modal-body">
                    <div className="profile-left-col">
                        <section className="profile-section">
                            <h3>BIOGRAPHY</h3>
                            <p>I've been passionate about graphic design and digital art from an early age with a keen interest in Website and Mobile Application User Interfaces. I can create high-quality and aesthetically pleasing designs in a quick turnaround time. Check out the portfolio section of my profile to see samples of my work and feel free to discuss your designing needs. I mostly use Adobe Photoshop, Illustrator, XD and Figma. *Website User Experience and Interface (UI/UX) Design - for all kinds of Professional and Personal websites. *Mobile Application User Experience and Interface Design - for all kinds of iOS/Android and Hybrid Mobile Applications. *Wireframe Designs.</p>
                        </section>

                        <section className="profile-section">
                            <h3>COVER LETTER</h3>
                            <div className="cover-letter-text">
                                <p>Dear Sir,</p>
                                <p>I am writing to express my interest in the fourth grade instructional position that is currently available in the Fort Wayne Community School System. I learned of the opening through a notice posted on JobZone, IPFW's job database. I am confident that my academic background and curriculum development skills would be successfully utilized in this teaching position.</p>
                                <p>I have just completed my Bachelor of Science degree in Elementary Education and have successfully completed Praxis I and Praxis II. During my student teaching experience, I developed and initiated a three-week curriculum sequence on animal species and earth resources. This collaborative unit involved working with three other third grade teachers within my team, and culminated in a field trip to the Indianapolis Zoo Animal Research Unit.</p>
                                <p>Sincerely,<br />Esther Howard</p>
                            </div>
                        </section>

                        <section className="profile-section">
                            <h3>Follow me Social Media</h3>
                            <div className="social-links-grid">
                                <a href="#" className="social-box fb"><FaFacebookF /></a>
                                <a href="#" className="social-box tw"><FaTwitter /></a>
                                <a href="#" className="social-box ln"><FaLinkedinIn /></a>
                                <a href="#" className="social-box rd"><FaRedditAlien /></a>
                                <a href="#" className="social-box ig"><FaInstagram /></a>
                                <a href="#" className="social-box yt"><FaYoutube /></a>
                            </div>
                        </section>
                    </div>

                    <div className="profile-right-col">
                        <div className="info-cards-grid">
                            <div className="info-mini-card">
                                <FaCalendarAlt className="icon" />
                                <div className="text">
                                    <span className="label">DATE OF BIRTH</span>
                                    <span className="value">14 June, 2021</span>
                                </div>
                            </div>
                            <div className="info-mini-card">
                                <FaFlag className="icon" />
                                <div className="text">
                                    <span className="label">NATIONALITY</span>
                                    <span className="value">Bangladesh</span>
                                </div>
                            </div>
                            <div className="info-mini-card">
                                <FaUser className="icon" />
                                <div className="text">
                                    <span className="label">MARITAL STATUS</span>
                                    <span className="value">Single</span>
                                </div>
                            </div>
                            <div className="info-mini-card">
                                <FaMars className="icon" />
                                <div className="text">
                                    <span className="label">GENDER</span>
                                    <span className="value">Male</span>
                                </div>
                            </div>
                            <div className="info-mini-card">
                                <FaBriefcase className="icon" />
                                <div className="text">
                                    <span className="label">EXPERIENCE</span>
                                    <span className="value">7 Years</span>
                                </div>
                            </div>
                            <div className="info-mini-card">
                                <FaGraduationCap className="icon" />
                                <div className="text">
                                    <span className="label">EDUCATION</span>
                                    <span className="value">Master Degree</span>
                                </div>
                            </div>
                        </div>

                        <div className="resume-download-card">
                            <h4>Download My Resume</h4>
                            <div className="resume-box">
                                <div className="file-info">
                                    <div className="file-icon-bg">PDF</div>
                                    <div className="file-text">
                                        <span className="name">{candidate.name}</span>
                                        <span className="type">PDF</span>
                                    </div>
                                </div>
                                <button className="dl-btn"><FaDownload /></button>
                            </div>
                        </div>

                        <div className="contact-info-card">
                            <h4>Contact Information</h4>
                            <div className="contact-item">
                                <FaGlobe className="icon" />
                                <div className="text">
                                    <span className="label">WEBSITE</span>
                                    <span className="value">www.estherhoward.com</span>
                                </div>
                            </div>
                            <div className="contact-item">
                                <FaMapMarkerAlt className="icon" />
                                <div className="text">
                                    <span className="label">LOCATION</span>
                                    <span className="value">Beverly Hills, California 90202</span>
                                    <p className="sub-text">Zone/Block Basement 1 Unit B2, 1372 Spring Avenue, Portland,</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <FaPhoneAlt className="icon" />
                                <div className="text">
                                    <span className="label">PHONE</span>
                                    <span className="value">+1-202-555-0141</span>
                                    <span className="value">+1-202-555-0189</span>
                                </div>
                            </div>
                            <div className="contact-item">
                                <FaEnvelope className="icon" />
                                <div className="text">
                                    <span className="label">EMAIL ADDRESS</span>
                                    <span className="value">esther.howard@gmail.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateProfileModal;
