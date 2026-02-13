import React, { useState, useEffect } from 'react';
import './CompanySetup.css';
import { FaInfoCircle, FaUsers, FaGlobe, FaPhoneAlt, FaArrowRight, FaArrowLeft, FaSave } from 'react-icons/fa';
import CompanyNavbar from './components/CompanyNavbar';
import CompanySidebar from './components/CompanySidebar';
import { getCompanyProfile, updateCompanyProfile } from '../../services/api';

const CompanySetup = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [formData, setFormData] = useState({
        companyName: '',
        companyEmail: '',
        phoneNumber: '',
        website: '',
        industry: '',
        companySize: '',
        description: '',
        logo: '',
        bannerImage: '',
        headquarterAddress: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        linkedInUrl: '',
        twitterUrl: '',
        facebookUrl: '',
        founded: '',
        techStack: []
    });

    const steps = [
        { id: 1, label: 'Company Info', icon: <FaInfoCircle /> },
        { id: 2, label: 'Founding Info', icon: <FaUsers /> },
        { id: 3, label: 'Social Media Profile', icon: <FaGlobe /> },
        { id: 4, label: 'Contact', icon: <FaPhoneAlt /> }
    ];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await getCompanyProfile();
            
            if (response.success) {
                const profile = response.data;
                setFormData({
                    companyName: profile.companyName || '',
                    companyEmail: profile.companyEmail || '',
                    phoneNumber: profile.phoneNumber || '',
                    website: profile.website || '',
                    industry: profile.industry || '',
                    companySize: profile.companySize || '',
                    description: profile.description || '',
                    logo: profile.logo || '',
                    bannerImage: profile.bannerImage || '',
                    headquarterAddress: profile.headquarterAddress || '',
                    city: profile.city || '',
                    state: profile.state || '',
                    country: profile.country || '',
                    zipCode: profile.zipCode || '',
                    linkedInUrl: profile.linkedInUrl || '',
                    twitterUrl: profile.twitterUrl || '',
                    facebookUrl: profile.facebookUrl || '',
                    founded: profile.founded ? new Date(profile.founded).toISOString().split('T')[0] : '',
                    techStack: profile.techStack || []
                });
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTechStackChange = (e) => {
        const value = e.target.value;
        const techArray = value.split(',').map(t => t.trim()).filter(t => t);
        setFormData(prev => ({ ...prev, techStack: techArray }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError('');
            setSuccess('');

            // Prepare data for submission
            const profileData = {
                ...formData,
                founded: formData.founded ? new Date(formData.founded).toISOString() : null
            };

            const response = await updateCompanyProfile(profileData);

            if (response.success) {
                setSuccess('Profile updated successfully!');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(response.message || 'Failed to update profile');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveAndNext = () => {
        handleSave();
        if (step < 4) {
            setStep(step + 1);
        }
    };

    if (loading) {
        return (
            <div className="comp-layout">
                <CompanyNavbar />
                <div className="comp-container">
                    <div className="container comp-flex">
                        <CompanySidebar />
                        <main className="comp-main-content">
                            <div className="loading-message">Loading profile...</div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="comp-layout">
            <CompanyNavbar />
            <div className="comp-container">
                <div className="container comp-flex">
                    <CompanySidebar />

                    <main className="comp-main-content">
                        {error && <div className="error-message" style={{ marginBottom: '15px' }}>{error}</div>}
                        {success && <div className="success-message" style={{ marginBottom: '15px', padding: '10px', background: '#d4edda', color: '#155724', borderRadius: '4px' }}>{success}</div>}
                        
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
                            {/* Step 1: Company Info */}
                            {step === 1 && (
                                <section className="setup-section">
                                    <h2 className="section-main-title">Company Information</h2>

                                    <div className="form-row">
                                        <div className="form-group-large">
                                            <label className="input-label">Logo Image URL</label>
                                            <p style={{ fontSize: '13px', color: '#767f8c', marginBottom: '8px' }}>Square image recommended (e.g., 200x200px)</p>
                                            <input
                                                type="url"
                                                name="logo"
                                                className="premium-input"
                                                placeholder="https://example.com/company-logo.png"
                                                value={formData.logo}
                                                onChange={handleInputChange}
                                            />
                                            {formData.logo && (
                                                <div style={{ marginTop: '10px', width: '120px', height: '120px', border: '2px solid #e4e5e8', borderRadius: '8px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
                                                    <img 
                                                        src={formData.logo} 
                                                        alt="Logo Preview" 
                                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Logo' }}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="form-group-large">
                                            <label className="input-label">Banner Image URL</label>
                                            <p style={{ fontSize: '13px', color: '#767f8c', marginBottom: '8px' }}>Wide image recommended (e.g., 1200x400px)</p>
                                            <input
                                                type="url"
                                                name="bannerImage"
                                                className="premium-input"
                                                placeholder="https://example.com/company-banner.jpg"
                                                value={formData.bannerImage}
                                                onChange={handleInputChange}
                                            />
                                            {formData.bannerImage && (
                                                <div style={{ marginTop: '10px', width: '100%', height: '100px', border: '2px solid #e4e5e8', borderRadius: '8px', overflow: 'hidden', background: '#f9fafb' }}>
                                                    <img 
                                                        src={formData.bannerImage} 
                                                        alt="Banner Preview" 
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x100?text=Banner' }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="form-group-large">
                                        <label className="input-label">Company Name*</label>
                                        <input 
                                            type="text" 
                                            name="companyName"
                                            className="premium-input" 
                                            placeholder="Enter company name"
                                            value={formData.companyName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-large">
                                        <label className="input-label">About Us</label>
                                        <div className="rich-textarea-container">
                                            <textarea 
                                                name="description"
                                                className="premium-textarea" 
                                                placeholder="Write down about your company here. Let the candidate know who we are..."
                                                value={formData.description}
                                                onChange={handleInputChange}
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group-large">
                                            <label className="input-label">Industry</label>
                                            <input 
                                                type="text" 
                                                name="industry"
                                                className="premium-input" 
                                                placeholder="e.g., Technology, Healthcare"
                                                value={formData.industry}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group-large">
                                            <label className="input-label">Company Size</label>
                                            <select
                                                name="companySize"
                                                className="premium-input"
                                                value={formData.companySize}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select size</option>
                                                <option value="1-10">1-10 employees</option>
                                                <option value="10-50">10-50 employees</option>
                                                <option value="50-200">50-200 employees</option>
                                                <option value="200-500">200-500 employees</option>
                                                <option value="500+">500+ employees</option>
                                            </select>
                                        </div>
                                    </div>

                                    <footer className="setup-footer" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                        <button className="save-btn" onClick={handleSave} disabled={saving} style={{ background: '#6c757d' }}>
                                            <FaSave /> {saving ? 'Saving...' : 'Save'}
                                        </button>
                                        <button className="save-next-btn" onClick={handleSaveAndNext} disabled={saving}>
                                            {saving ? 'Saving...' : 'Save & Next'} <FaArrowRight />
                                        </button>
                                    </footer>
                                </section>
                            )}

                            {/* Step 2: Founding Info */}
                            {step === 2 && (
                                <section className="setup-section">
                                    <h2 className="section-main-title">Founding Information</h2>

                                    <div className="form-row">
                                        <div className="form-group-large">
                                            <label className="input-label">Founded Date</label>
                                            <input 
                                                type="date" 
                                                name="founded"
                                                className="premium-input"
                                                value={formData.founded}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group-large">
                                            <label className="input-label">Website</label>
                                            <input 
                                                type="url" 
                                                name="website"
                                                className="premium-input" 
                                                placeholder="https://example.com"
                                                value={formData.website}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group-large">
                                        <label className="input-label">Tech Stack (comma-separated)</label>
                                        <input 
                                            type="text" 
                                            className="premium-input" 
                                            placeholder="e.g., React, Node.js, Python, AWS"
                                            value={formData.techStack.join(', ')}
                                            onChange={handleTechStackChange}
                                        />
                                    </div>

                                    <footer className="setup-footer" style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
                                        <button className="prev-btn" onClick={() => setStep(1)} disabled={saving} style={{ background: '#6c757d' }}>
                                            <FaArrowLeft /> Previous
                                        </button>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button className="save-btn" onClick={handleSave} disabled={saving} style={{ background: '#6c757d' }}>
                                                <FaSave /> {saving ? 'Saving...' : 'Save'}
                                            </button>
                                            <button className="save-next-btn" onClick={handleSaveAndNext} disabled={saving}>
                                                {saving ? 'Saving...' : 'Save & Next'} <FaArrowRight />
                                            </button>
                                        </div>
                                    </footer>
                                </section>
                            )}

                            {/* Step 3: Social Media */}
                            {step === 3 && (
                                <section className="setup-section">
                                    <h2 className="section-main-title">Social Media Profile</h2>

                                    <div className="form-group-large">
                                        <label className="input-label">LinkedIn URL</label>
                                        <input 
                                            type="url" 
                                            name="linkedInUrl"
                                            className="premium-input" 
                                            placeholder="https://linkedin.com/company/yourcompany"
                                            value={formData.linkedInUrl}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-group-large">
                                        <label className="input-label">Twitter URL</label>
                                        <input 
                                            type="url" 
                                            name="twitterUrl"
                                            className="premium-input" 
                                            placeholder="https://twitter.com/yourcompany"
                                            value={formData.twitterUrl}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-group-large">
                                        <label className="input-label">Facebook URL</label>
                                        <input 
                                            type="url" 
                                            name="facebookUrl"
                                            className="premium-input" 
                                            placeholder="https://facebook.com/yourcompany"
                                            value={formData.facebookUrl}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <footer className="setup-footer" style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
                                        <button className="prev-btn" onClick={() => setStep(2)} disabled={saving} style={{ background: '#6c757d' }}>
                                            <FaArrowLeft /> Previous
                                        </button>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button className="save-btn" onClick={handleSave} disabled={saving} style={{ background: '#6c757d' }}>
                                                <FaSave /> {saving ? 'Saving...' : 'Save'}
                                            </button>
                                            <button className="save-next-btn" onClick={handleSaveAndNext} disabled={saving}>
                                                {saving ? 'Saving...' : 'Save & Next'} <FaArrowRight />
                                            </button>
                                        </div>
                                    </footer>
                                </section>
                            )}

                            {/* Step 4: Contact */}
                            {step === 4 && (
                                <section className="setup-section">
                                    <h2 className="section-main-title">Contact Information</h2>

                                    <div className="form-row">
                                        <div className="form-group-large">
                                            <label className="input-label">Company Email*</label>
                                            <input 
                                                type="email" 
                                                name="companyEmail"
                                                className="premium-input" 
                                                placeholder="contact@company.com"
                                                value={formData.companyEmail}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group-large">
                                            <label className="input-label">Phone Number*</label>
                                            <input 
                                                type="tel" 
                                                name="phoneNumber"
                                                className="premium-input" 
                                                placeholder="+1 234 567 8900"
                                                value={formData.phoneNumber}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group-large">
                                        <label className="input-label">Headquarter Address</label>
                                        <input 
                                            type="text" 
                                            name="headquarterAddress"
                                            className="premium-input" 
                                            placeholder="123 Main St"
                                            value={formData.headquarterAddress}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group-large">
                                            <label className="input-label">City</label>
                                            <input 
                                                type="text" 
                                                name="city"
                                                className="premium-input" 
                                                placeholder="San Francisco"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group-large">
                                            <label className="input-label">State</label>
                                            <input 
                                                type="text" 
                                                name="state"
                                                className="premium-input" 
                                                placeholder="CA"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group-large">
                                            <label className="input-label">Country</label>
                                            <input 
                                                type="text" 
                                                name="country"
                                                className="premium-input" 
                                                placeholder="USA"
                                                value={formData.country}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group-large">
                                            <label className="input-label">Zip Code</label>
                                            <input 
                                                type="text" 
                                                name="zipCode"
                                                className="premium-input" 
                                                placeholder="94105"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <footer className="setup-footer" style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
                                        <button className="prev-btn" onClick={() => setStep(3)} disabled={saving} style={{ background: '#6c757d' }}>
                                            <FaArrowLeft /> Previous
                                        </button>
                                        <button className="save-next-btn" onClick={handleSave} disabled={saving}>
                                            <FaSave /> {saving ? 'Saving...' : 'Update Profile'}
                                        </button>
                                    </footer>
                                </section>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default CompanySetup;
