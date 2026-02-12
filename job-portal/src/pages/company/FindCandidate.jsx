import React, { useState } from 'react';
import CompanyNavbar from './components/CompanyNavbar';
import CompanySidebar from './components/CompanySidebar';
import CandidateProfileModal from './components/CandidateProfileModal';
import { FaSearch, FaMapMarkerAlt, FaRegBookmark, FaChevronRight, FaFilter } from 'react-icons/fa';
import './FindCandidate.css';

const FindCandidate = () => {
    const [candidates] = useState([
        { id: 1, name: 'Ronald Richards', role: 'UI/UX Designer', location: 'New York, USA', image: 'https://i.pravatar.cc/150?u=Ronald+Richards' },
        { id: 2, name: 'Theresa Webb', role: 'Product Designer', location: 'London, UK', image: 'https://i.pravatar.cc/150?u=Theresa+Webb' },
        { id: 3, name: 'Esther Howard', role: 'Website Designer', location: 'San Francisco, USA', image: 'https://i.pravatar.cc/150?u=Esther+Howard' },
        { id: 4, name: 'Guy Hawkins', role: 'Technical Support Specialist', location: 'Chicago, USA', image: 'https://i.pravatar.cc/150?u=Guy+Hawkins' },
        { id: 5, name: 'Albert Flores', role: 'Marketing Officer', location: 'California, USA', image: 'https://i.pravatar.cc/150?u=Albert+Flores' },
        { id: 6, name: 'Savannah Nguyen', role: 'Visual Designer', location: 'Texas, USA', image: 'https://i.pravatar.cc/150?u=Savannah+Nguyen' },
    ]);

    const [modalData, setModalData] = useState({ isOpen: false, candidate: null });

    return (
        <div className="comp-layout">
            <CompanyNavbar />
            <div className="comp-container">
                <div className="container comp-flex">
                    <CompanySidebar />

                    <main className="comp-main-content">
                        <div className="find-candidate-header">
                            <h1>Find Candidate</h1>
                            <div className="search-filter-box">
                                <div className="search-input-group">
                                    <FaSearch className="icon" />
                                    <input type="text" placeholder="Candidate name, role..." />
                                </div>
                                <div className="location-input-group">
                                    <FaMapMarkerAlt className="icon" />
                                    <input type="text" placeholder="City, state, zip code" />
                                </div>
                                <button className="filters-btn"><FaFilter /> Filter</button>
                                <button className="find-btn">Find Candidate</button>
                            </div>
                        </div>

                        <div className="candidates-grid-premium">
                            {candidates.map((c) => (
                                <div key={c.id} className="candidate-card-v2">
                                    <div className="card-header-actions">
                                        <button className="card-bookmark"><FaRegBookmark /></button>
                                    </div>
                                    <div className="card-main-content">
                                        <div className="candidate-avatar-large">
                                            <img src={c.image} alt={c.name} />
                                        </div>
                                        <h4>{c.name}</h4>
                                        <p className="role">{c.role}</p>
                                        <div className="location-text">
                                            <FaMapMarkerAlt /> {c.location}
                                        </div>
                                    </div>
                                    <div className="card-footer-actions">
                                        <button className="view-profile-btn-full" onClick={() => setModalData({ isOpen: true, candidate: c })}>
                                            View Profile <FaChevronRight />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <footer className="comp-footer-minimal">
                            <p>© 2021 Jobpilot - Job Board. All rights Reserved</p>
                        </footer>
                    </main>
                </div>
            </div>

            <CandidateProfileModal
                isOpen={modalData.isOpen}
                onClose={() => setModalData({ isOpen: false, candidate: null })}
                candidate={modalData.candidate}
            />
        </div>
    );
};

export default FindCandidate;
