import React, { useEffect, useState } from 'react';
import CompanyNavbar from './components/CompanyNavbar';
import CompanySidebar from './components/CompanySidebar';
import CandidateProfileModal from './components/CandidateProfileModal';
import { FaRegBookmark, FaBookmark, FaEllipsisV, FaEnvelope, FaDownload, FaChevronRight } from 'react-icons/fa';
import { getSavedCandidates, removeSavedCandidate } from '../../services/api';
import './SavedCandidates.css';

const SavedCandidates = () => {
    const [savedCandidates, setSavedCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeActionMenu, setActiveActionMenu] = useState(null);
    const [modalData, setModalData] = useState({ isOpen: false, candidate: null });

    useEffect(() => {
        const loadSavedCandidates = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await getSavedCandidates();
                if (response.success && response.data) {
                    setSavedCandidates(response.data);
                } else {
                    setSavedCandidates([]);
                }
            } catch (err) {
                console.error('Error fetching saved candidates:', err);
                setError('Failed to load saved candidates. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadSavedCandidates();
    }, []);

    const handleRemoveSaved = async (candidateId) => {
        try {
            await removeSavedCandidate(candidateId);
            setSavedCandidates(prev => prev.filter(item => item.candidate?.id !== candidateId));
        } catch (err) {
            console.error('Error removing saved candidate:', err);
            alert('Failed to remove candidate. Please try again.');
        }
    };

    const openProfile = (candidate) => {
        const name = `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim();
        setModalData({
            isOpen: true,
            candidate: {
                name: name || 'Candidate',
                role: candidate.currentJobTitle || 'Candidate',
                image: candidate.profilePicture
            }
        });
    };

    return (
        <>
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

                        {loading && (
                            <div className="loading-message">Loading saved candidates...</div>
                        )}

                        {error && !loading && (
                            <div className="error-message">{error}</div>
                        )}

                        {!loading && !error && savedCandidates.length === 0 && (
                            <div className="empty-state">No saved candidates yet.</div>
                        )}

                        {!loading && !error && savedCandidates.length > 0 && (
                            <div className="candidates-list-wrapper">
                                {savedCandidates.map((item) => {
                                    const candidate = item.candidate || {};
                                    const name = `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim();
                                    return (
                                        <div key={item.id} className="candidate-row-card">
                                            <div className="candidate-basic-info">
                                                <div className="candidate-avatar-square">
                                                    {candidate.profilePicture ? (
                                                        <img src={candidate.profilePicture} alt={name} />
                                                    ) : (
                                                        <div className="candidate-avatar-fallback">
                                                            {`${candidate.firstName?.[0] || ''}${candidate.lastName?.[0] || ''}`}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="candidate-name-box">
                                                    <h4>{name || 'Candidate'}</h4>
                                                    <p>{candidate.currentJobTitle || 'Candidate'}</p>
                                                </div>
                                            </div>

                                            <div className="candidate-actions-flex">
                                                <button
                                                    className="bookmark-btn active"
                                                    onClick={() => handleRemoveSaved(candidate.id)}
                                                    title="Remove from saved"
                                                >
                                                    <FaBookmark />
                                                </button>
                                                <button
                                                    className="view-profile-btn-premium"
                                                    onClick={() => openProfile(candidate)}
                                                >
                                                    View Profile <FaChevronRight />
                                                </button>
                                                <div className="more-action-wrap">
                                                    <button
                                                        className="dots-btn"
                                                        onClick={() => setActiveActionMenu(activeActionMenu === item.id ? null : item.id)}
                                                    >
                                                        <FaEllipsisV />
                                                    </button>
                                                    {activeActionMenu === item.id && (
                                                        <div className="action-dropdown-small">
                                                            <button onClick={() => window.location.href = `mailto:${candidate.email || ''}`}>
                                                                <FaEnvelope /> Send Email
                                                            </button>
                                                            <button
                                                                onClick={() => candidate.resumeUrl && window.open(candidate.resumeUrl, '_blank')}
                                                                disabled={!candidate.resumeUrl}
                                                            >
                                                                <FaDownload /> Download Cv
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <footer className="comp-footer-minimal">
                            <p>© 2021 Jobpilot - Job Board. All rights Reserved</p>
                        </footer>
                    </main>
                </div>
            </div>
        </div>

        <CandidateProfileModal
            isOpen={modalData.isOpen}
            onClose={() => setModalData({ isOpen: false, candidate: null })}
            candidate={modalData.candidate}
        />
        </>
    );
};

export default SavedCandidates;
