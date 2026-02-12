import React, { useState } from 'react';
import './CompanySetup.css';
import { FaInfoCircle, FaUsers, FaGlobe, FaPhoneAlt, FaArrowRight } from 'react-icons/fa';
import { IoCloudUploadOutline } from 'react-icons/io5';
import CompanyNavbar from './components/CompanyNavbar';
import CompanySidebar from './components/CompanySidebar';

const CompanySetup = () => {
    const [step, setStep] = useState(1);
    const [logo, setLogo] = useState(null);
    const [banner, setBanner] = useState(null);

    const steps = [
        { id: 1, label: 'Company Info', icon: <FaInfoCircle /> },
        { id: 2, label: 'Founding Info', icon: <FaUsers /> },
        { id: 3, label: 'Social Media Profile', icon: <FaGlobe /> },
        { id: 4, label: 'Contact', icon: <FaPhoneAlt /> }
    ];

    return (
        <div className="comp-layout">
            <CompanyNavbar />
            <div className="comp-container">
                <div className="container comp-flex">
                    <CompanySidebar />

                    <main className="comp-main-content">
                        <div className="setup-progress-header">
                            <div className="setup-progress-box">
                                <div className="progress-labels">
                                    <span>Setup Progress</span>
                                    <span>{step * 25}%</span>
                                </div>
                                <div className="progress-bar-bg">
                                    <div className="progress-bar-fill" style={{ width: `${step * 25}%` }}></div>
                                </div>
                            </div>
                        </div>

                        <nav className="setup-stepper">
                            {steps.map((s) => (
                                <div
                                    key={s.id}
                                    className={`stepper-item ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}
                                    onClick={() => setStep(s.id)}
                                >
                                    <span className="step-icon">{s.icon}</span>
                                    <span className="step-label">{s.label}</span>
                                    {step === s.id && <div className="active-glow"></div>}
                                </div>
                            ))}
                        </nav>

                        <div className="setup-card">
                            <section className="setup-section">
                                <h2 className="section-main-title">Logo & Banner Image</h2>

                                <div className="upload-grid">
                                    <div className="upload-column">
                                        <label className="input-label">Upload Logo</label>
                                        <div className="upload-area logo-upload" onClick={() => document.getElementById('logo-file').click()}>
                                            <input type="file" id="logo-file" hidden onChange={(e) => setLogo(URL.createObjectURL(e.target.files[0]))} />
                                            {logo ? (
                                                <img src={logo} alt="Logo Preview" className="preview-img" />
                                            ) : (
                                                <>
                                                    <IoCloudUploadOutline className="upload-icon-large" />
                                                    <p className="upload-text"><strong>Browse photo</strong> or drop here</p>
                                                    <p className="upload-hint">A photo larger than 400 pixels work best. Max photo size 5 MB.</p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="upload-column banner-col">
                                        <label className="input-label">Banner Image</label>
                                        <div className="upload-area banner-upload" onClick={() => document.getElementById('banner-file').click()}>
                                            <input type="file" id="banner-file" hidden onChange={(e) => setBanner(URL.createObjectURL(e.target.files[0]))} />
                                            {banner ? (
                                                <img src={banner} alt="Banner Preview" className="preview-img" />
                                            ) : (
                                                <>
                                                    <IoCloudUploadOutline className="upload-icon-large" />
                                                    <p className="upload-text"><strong>Browse photo</strong> or drop here</p>
                                                    <p className="upload-hint">Banner images optical dimension 1520x400. Supported format JPEG, PNG. Max photo size 5 MB.</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group-large">
                                    <label className="input-label">Company name</label>
                                    <input type="text" className="premium-input" placeholder="Enter company name" />
                                </div>

                                <div className="form-group-large">
                                    <label className="input-label">About Us</label>
                                    <div className="rich-textarea-container">
                                        <textarea className="premium-textarea" placeholder="Write down about your company here. Let the candidate know who we are..."></textarea>
                                        <div className="textarea-toolbar">
                                            <button type="button" className="tool-btn"><strong>B</strong></button>
                                            <button type="button" className="tool-btn"><em>I</em></button>
                                            <button type="button" className="tool-btn"><u>U</u></button>
                                            <div className="tool-divider"></div>
                                            <button type="button" className="tool-btn">#</button>
                                            <button type="button" className="tool-btn">...</button>
                                        </div>
                                    </div>
                                </div>

                                <footer className="setup-footer">
                                    <button className="save-next-btn">
                                        Save & Next <FaArrowRight />
                                    </button>
                                </footer>
                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default CompanySetup;
