import React from 'react';
import Header from './components/Header';
import './CustomerSupport.css';
import { FaPhoneAlt, FaEnvelope, FaQuestionCircle } from 'react-icons/fa';

const CustomerSupport = () => {
    return (
        <div className="support-page">
            <Header />
            <div className="container support-container">
                <div className="support-header">
                    <h1>How can we help you?</h1>
                    <div className="search-support">
                        <input type="text" placeholder="Search for answers..." />
                        <button>Search</button>
                    </div>
                </div>

                <div className="support-actions">
                    <div className="support-card">
                        <div className="support-icon"><FaQuestionCircle /></div>
                        <h3>FAQs</h3>
                        <p>Find answers to common questions about using our platform.</p>
                        <button className="support-btn">View FAQs</button>
                    </div>
                    <div className="support-card">
                        <div className="support-icon"><FaEnvelope /></div>
                        <h3>Email Us</h3>
                        <p>Send us an email and we'll get back to you within 24 hours.</p>
                        <button className="support-btn">Contact Support</button>
                    </div>
                    <div className="support-card">
                        <div className="support-icon"><FaPhoneAlt /></div>
                        <h3>Call Us</h3>
                        <p>Speak directly with our support team for urgent issues.</p>
                        <button className="support-btn">Call Now</button>
                    </div>
                </div>

                <div className="faq-section">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-item">
                        <div className="faq-question">How do I reset my password?</div>
                        <div className="faq-answer">You can reset your password by clicking on "Forgot Password" on the login page.</div>
                    </div>
                    <div className="faq-item">
                        <div className="faq-question">How do I apply for a job?</div>
                        <div className="faq-answer">Simply click on the "Apply Now" button on any job listing.</div>
                    </div>
                    <div className="faq-item">
                        <div className="faq-question">Can I update my profile later?</div>
                        <div className="faq-answer">Yes, you can update your profile information from your Dashboard settings at any time.</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerSupport;
