import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import {
    FaUserPlus, FaSearch, FaArrowRight, FaMapMarkerAlt,
    FaCloudUploadAlt, FaCheckDouble, FaBriefcase, FaBuilding,
    FaUsers, FaCode, FaPaintBrush, FaBullhorn, FaChartLine
} from 'react-icons/fa';
import { jobs } from './candidate/data/jobs';
import JobCard from './candidate/components/JobCard';

const Home = () => {
    // Featured jobs (take first 4)
    const featuredJobs = jobs.slice(0, 4);

    const categories = [
        { icon: <FaPaintBrush />, name: "Graphics & Design", count: 357 },
        { icon: <FaCode />, name: "Code & Programming", count: 312 },
        { icon: <FaBullhorn />, name: "Digital Marketing", count: 297 },
        { icon: <FaChartLine />, name: "Video & Animation", count: 247 },
        { icon: <FaBriefcase />, name: "Music & Audio", count: 204 },
        { icon: <FaBuilding />, name: "Account & Finance", count: 167 },
        { icon: <FaUsers />, name: "Health & Care", count: 125 },
        { icon: <FaChartLine />, name: "Data & Science", count: 57 },
    ];

    return (
        <div className="landing-page">
            <nav className="landing-nav">
                <div className="container nav-content">
                    <div className="logo">
                        <span className="logo-icon"><FaBriefcase /></span>
                        Jobpilot
                    </div>
                    <div className="nav-search-header">
                        <div className="country-selector">
                            <img src="https://flagcdn.com/w20/in.png" alt="India" /> India <span className="chevron-down"></span>
                        </div>
                        <div className="header-search">
                            <FaSearch />
                            <input type="text" placeholder="Job title, keyword, company" />
                        </div>
                    </div>
                    <div className="nav-links">
                        <Link to="/login" className="login-link-btn">Sign In</Link>
                        <Link to="/candidate/post-job" className="post-job-btn">Post A Job</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-section">
                <div className="container hero-container">
                    <div className="hero-left">
                        <h1>Find a job that suits <br />your interest & skills.</h1>
                        <p className="hero-subtitle">
                            Aliquam vitae turpis in dam convallis finibus in at risus.
                            Nullam in scelerisque leo, eget sollicitudin velit bestibulum.
                        </p>

                        <div className="hero-search-box">
                            <div className="input-group">
                                <FaSearch className="search-icon" />
                                <input type="text" placeholder="Job title, Keyword..." />
                            </div>
                            <div className="input-divider"></div>
                            <div className="input-group">
                                <FaMapMarkerAlt className="search-icon" />
                                <input type="text" placeholder="Your Location" />
                            </div>
                            <button className="hero-search-btn">Find Job</button>
                        </div>
                        <p className="search-suggestion">
                            Suggestion: Designer, Programming, <span className="highlight-text">Digital Marketing</span>, Video, Animation.
                        </p>
                    </div>

                    <div className="hero-right">
                        <img
                            src="https://cdni.iconscout.com/illustration/premium/thumb/searching-for-job-illustration-download-in-svg-png-gif-formats--vacancy-looking-hiring-business-pack-people-illustrations-5219356.png"
                            alt="Job Hunt Illustration"
                            className="hero-illustration"
                        />
                    </div>
                </div>
            </header>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon-box blue-soft"><FaBriefcase /></div>
                        <div className="stat-info">
                            <h3>1,75,324</h3>
                            <p>Live Job</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon-box blue-dark"><FaBuilding /></div>
                        <div className="stat-info">
                            <h3>97,354</h3>
                            <p>Companies</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon-box blue-med"><FaUsers /></div>
                        <div className="stat-info">
                            <h3>38,47,154</h3>
                            <p>Candidates</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon-box blue-soft"><FaBriefcase /></div>
                        <div className="stat-info">
                            <h3>7,532</h3>
                            <p>New Jobs</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Most Popular Vacancies */}
            <section className="vacancies-section">
                <div className="container">
                    <h2 className="section-title">Most Popular Vacancies</h2>
                    <div className="vacancies-grid">
                        {[
                            { name: "Anesthesiologists", count: "45,904" },
                            { name: "Surgeons", count: "50,364" },
                            { name: "Obstetricians-Gynecologists", count: "4,339" },
                            { name: "Orthodontists", count: "20,079" },
                            { name: "Maxillofacial Surgeons", count: "74,875" },
                            { name: "Software Developer", count: "43,359" },
                            { name: "Psychiatrists", count: "18,599" },
                            { name: "Data Scientist", count: "28,200", highlighted: true },
                            { name: "Financial Manager", count: "61,391" },
                            { name: "Management Analysis", count: "93,046" },
                            { name: "IT Manager", count: "50,963" },
                            { name: "Operations Research Analysis", count: "16,627" }
                        ].map((job, index) => (
                            <div key={index} className="vacancy-item">
                                <h4 style={{ color: job.highlighted ? '#1d4ed8' : 'inherit', textDecoration: job.highlighted ? 'underline' : 'none' }}>{job.name}</h4>
                                <p>{job.count} Open Positions</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="how-it-works-section">
                <div className="container">
                    <h2 className="section-title center">How jobpilot work</h2>

                    <div className="steps-container">
                        <div className="step-item">
                            <div className="step-icon">
                                <FaUserPlus />
                            </div>
                            <h4>Create account</h4>
                            <p>Aliquam facilisis egestas sapien, nec tempor leo tristique at.</p>
                        </div>
                        <div className="step-connector">
                            <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none">
                                <path d="M0,20 Q50,0 100,20" stroke="#ccc" strokeWidth="1" strokeDasharray="5,5" fill="none" />
                            </svg>
                        </div>
                        <div className="step-item active">
                            <div className="step-icon filled">
                                <FaCloudUploadAlt />
                            </div>
                            <h4>Upload CV/Resume</h4>
                            <p>Curabitur sit amet maximus ligula. Nam a nulla ante. Nam sodales.</p>
                        </div>
                        <div className="step-connector">
                            <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none">
                                <path d="M0,20 Q50,40 100,20" stroke="#ccc" strokeWidth="1" strokeDasharray="5,5" fill="none" />
                            </svg>
                        </div>
                        <div className="step-item">
                            <div className="step-icon">
                                <FaSearch />
                            </div>
                            <h4>Find suitable job</h4>
                            <p>Phasellus quis eleifend ex. Morbi nec fringilla nibh.</p>
                        </div>
                        <div className="step-connector">
                            <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none">
                                <path d="M0,20 Q50,0 100,20" stroke="#ccc" strokeWidth="1" strokeDasharray="5,5" fill="none" />
                            </svg>
                        </div>
                        <div className="step-item">
                            <div className="step-icon">
                                <FaCheckDouble />
                            </div>
                            <h4>Apply job</h4>
                            <p>Curabitur sit amet maximus ligula. Nam a nulla ante.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Category */}
            <section className="popular-category-section">
                <div className="container">
                    <div className="section-header-row">
                        <h2 className="section-title">Popular category</h2>
                        <Link to="/candidate/find-jobs" className="view-all-btn">View All <FaArrowRight /></Link>
                    </div>

                    <div className="category-grid">
                        {categories.map((cat, i) => (
                            <div key={i} className="category-card-home">
                                <div className="cat-icon-home">{cat.icon}</div>
                                <div className="cat-info-home">
                                    <h4>{cat.name}</h4>
                                    <p>{cat.count} Open position</p>
                                </div>
                            </div>
                        ))}
                        {/* Repeat specific one for visual balance if needed or add more categories */}
                    </div>
                </div>
            </section>

            {/* Featured Jobs */}
            <section className="featured-jobs-section">
                <div className="container">
                    <div className="section-header-row">
                        <h2 className="section-title">Featured job</h2>
                        <Link to="/candidate/find-jobs" className="view-all-btn">View All <FaArrowRight /></Link>
                    </div>

                    <div className="featured-jobs-grid">
                        {featuredJobs.map(job => (
                            <JobCard key={job.id} job={job} view="grid" />
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="main-footer">
                <div className="container footer-grid">
                    <div className="footer-col about">
                        <h3>Jobpilot</h3>
                        <p>Call now: <span>(319) 555-0115</span></p>
                        <p>6391 Elgin St. Celina, Delaware 10299, New York</p>
                    </div>
                    <div className="footer-col">
                        <h4>Quick Link</h4>
                        <ul>
                            <li><Link to="/">About</Link></li>
                            <li><Link to="/">Contact</Link></li>
                            <li><Link to="/">Pricing</Link></li>
                            <li><Link to="/">Blog</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Candidate</h4>
                        <ul>
                            <li><Link to="/candidate/find-jobs">Browse Jobs</Link></li>
                            <li><Link to="/candidate/find-companies">Browse Companies</Link></li>
                            <li><Link to="/candidate/dashboard">Candidate Dashboard</Link></li>
                            <li><Link to="/candidate/saved-jobs">Saved Jobs</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Employers</h4>
                        <ul>
                            <li><Link to="/">Post a Job</Link></li>
                            <li><Link to="/">Browse Candidates</Link></li>
                            <li><Link to="/">Employer Dashboard</Link></li>
                            <li><Link to="/">Applications</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Support</h4>
                        <ul>
                            <li><Link to="/candidate/customer-support">Faqs</Link></li>
                            <li><Link to="/candidate/customer-support">Privacy Policy</Link></li>
                            <li><Link to="/candidate/customer-support">Terms & Conditions</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="container">
                        <p>© 2024 Jobpilot - Job Portal. All rights Reserved</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
