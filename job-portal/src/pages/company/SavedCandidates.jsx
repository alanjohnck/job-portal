import React, { useState } from 'react';
import CompanyNavbar from './components/CompanyNavbar';
import CompanySidebar from './components/CompanySidebar';
import CandidateProfileModal from './components/CandidateProfileModal';
import { FaRegBookmark, FaBookmark, FaEllipsisV, FaEnvelope, FaDownload, FaChevronRight } from 'react-icons/fa';
import './SavedCandidates.css';

const SavedCandidates = () => {
    const [candidates] = useState([
        { id: 1, name: 'Guy Hawkins', role: 'Technical Support Specialist', image: 'https://i.pravatar.cc/150?u=Guy+Hawkins' },
        { id: 2, name: 'Jacob Jones', role: 'Product Designer', image: 'https://i.pravatar.cc/150?u=Jacob+Jones' },
        { id: 3, name: 'Cameron Williamson', role: 'Marketing Officer', image: 'https://i.pravatar.cc/150?u=Cameron+Williamson' },
        { id: 4, name: 'Robert Fox', role: 'Marketing Manager', image: 'https://i.pravatar.cc/150?u=Robert+Fox' },
        { id: 5, name: 'Kathryn Murphy', role: 'Junior Graphic Designer', image: 'https://i.pravatar.cc/150?u=Kathryn+Murphy' },
        { id: 6, name: 'Darlene Robertson', role: 'Visual Designer', image: 'https://i.pravatar.cc/150?u=Darlene+Robertson' },
        { id: 7, name: 'Kristin Watson', role: 'Senior UX Designer', image: 'https://i.pravatar.cc/150?u=Kristin+Watson' },
        { id: 8, name: 'Jenny Wilson', role: 'Interaction Designer', image: 'https://i.pravatar.cc/150?u=Jenny+Wilson' },
        { id: 9, name: 'Marvin McKinney', role: 'Networking Engineer', image: 'https://i.pravatar.cc/150?u=Marvin+McKinney' },
        { id: 10, name: 'Theresa Webb', role: 'Software Engineer', image: 'https://i.pravatar.cc/150?u=Theresa+Webb' },
    ]);

    const [modalData, setModalData] = useState({ isOpen: false, candidate: null });
    const [activeActionMenu, setActiveActionMenu] = useState(null);

    const openProfile = (candidate) => {
        setModalData({ isOpen: true, candidate });
    };

    return (
        <div className="comp-layout">
            <CompanyNavbar />
            <div className="comp-container">
                <div className="container comp-flex">
                    <CompanySidebar />

                    <main className="comp-main-content">
                        <div className="saved-candidates-header">
                            <h1>Saved Candidates</h1>
                            <span className="deadline-hint">ⓘ All of the candidates are visible until 24 march, 2021</span>
                        </div>

                        <div className="candidates-list-wrapper">
                            {candidates.map((c) => (
                                <div key={c.id} className={`candidate-row-card ${c.id === 3 ? 'highlighted' : ''}`}>
                                    <div className="candidate-basic-info">
                                        <div className="candidate-avatar-square">
                                            <img src={c.image} alt={c.name} />
                                        </div>
                                        <div className="candidate-name-box">
                                            <h4>{c.name}</h4>
                                            <p>{c.role}</p>
                                        </div>
                                    </div>

                                    <div className="candidate-actions-flex">
                                        <button className="bookmark-btn active"><FaBookmark /></button>
                                        <button className="view-profile-btn-premium" onClick={() => openProfile(c)}>
                                            View Profile <FaChevronRight />
                                        </button>
                                        <div className="more-action-wrap">
                                            <button className="dots-btn" onClick={() => setActiveActionMenu(activeActionMenu === c.id ? null : c.id)}>
                                                <FaEllipsisV />
                                            </button>
                                            {activeActionMenu === c.id && (
                                                <div className="action-dropdown-small">
                                                    <button><FaEnvelope /> Send Email</button>
                                                    <button><FaDownload /> Download Cv</button>
                                                </div>
                                            )}
                                        </div>
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

export default SavedCandidates;
