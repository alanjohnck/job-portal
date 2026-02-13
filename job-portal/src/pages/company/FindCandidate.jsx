import React, { useEffect, useState } from 'react';
import CompanyNavbar from './components/CompanyNavbar';
import CompanySidebar from './components/CompanySidebar';
import { FaSearch, FaMapMarkerAlt, FaRegBookmark, FaChevronRight, FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getSavedCandidates, removeSavedCandidate, saveCandidate, searchCandidates } from '../../services/api';
import './FindCandidate.css';

const FindCandidate = () => {
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState([]);
    const [savedIds, setSavedIds] = useState(new Set());
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError('');
                const [searchRes, savedRes] = await Promise.all([
                    searchCandidates('', ''),
                    getSavedCandidates()
                ]);

                if (searchRes.success && searchRes.data?.items) {
                    setCandidates(searchRes.data.items);
                }

                if (savedRes.success && savedRes.data) {
                    const ids = new Set(savedRes.data.map(item => item.candidate?.id));
                    setSavedIds(ids);
                }
            } catch (err) {
                console.error('Error loading candidates:', err);
                setError('Failed to load candidates. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleSearch = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await searchCandidates(keyword, location);
            if (response.success && response.data?.items) {
                setCandidates(response.data.items);
            } else {
                setCandidates([]);
            }
        } catch (err) {
            console.error('Error searching candidates:', err);
            setError('Failed to search candidates. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleSaveCandidate = async (candidateId) => {
        try {
            if (savedIds.has(candidateId)) {
                await removeSavedCandidate(candidateId);
                setSavedIds(prev => {
                    const next = new Set(prev);
                    next.delete(candidateId);
                    return next;
                });
            } else {
                await saveCandidate(candidateId);
                setSavedIds(prev => new Set(prev).add(candidateId));
            }
        } catch (err) {
            console.error('Error updating saved candidate:', err);
            alert('Failed to update saved candidate. Please try again.');
        }
    };

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
                                    <input
                                        type="text"
                                        placeholder="Candidate name, role..."
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                    />
                                </div>
                                <div className="location-input-group">
                                    <FaMapMarkerAlt className="icon" />
                                    <input
                                        type="text"
                                        placeholder="City, state, zip code"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
                                <button className="filters-btn"><FaFilter /> Filter</button>
                                <button className="find-btn" onClick={handleSearch}>
                                    Find Candidate
                                </button>
                            </div>
                        </div>

                        {loading && (
                            <div className="loading-message">Loading candidates...</div>
                        )}

                        {error && !loading && (
                            <div className="error-message">{error}</div>
                        )}

                        {!loading && !error && candidates.length === 0 && (
                            <div className="empty-state">No candidates found.</div>
                        )}

                        {!loading && !error && candidates.length > 0 && (
                            <div className="candidates-grid-premium">
                                {candidates.map((c) => {
                                    const name = `${c.firstName || ''} ${c.lastName || ''}`.trim();
                                    return (
                                        <div key={c.id} className="candidate-card-v2">
                                            <div className="card-header-actions">
                                                <button
                                                    className={`card-bookmark ${savedIds.has(c.id) ? 'active' : ''}`}
                                                    onClick={() => toggleSaveCandidate(c.id)}
                                                    title={savedIds.has(c.id) ? 'Remove from saved' : 'Save candidate'}
                                                >
                                                    <FaRegBookmark />
                                                </button>
                                            </div>
                                            <div className="card-main-content">
                                                <div className="candidate-avatar-large">
                                                    {c.profilePicture ? (
                                                        <img src={c.profilePicture} alt={name} />
                                                    ) : (
                                                        <div className="candidate-avatar-fallback">
                                                            {`${c.firstName?.[0] || ''}${c.lastName?.[0] || ''}`}
                                                        </div>
                                                    )}
                                                </div>
                                                <h4>{name || 'Candidate'}</h4>
                                                <p className="role">{c.currentJobTitle || 'Candidate'}</p>
                                                <div className="location-text">
                                                    <FaMapMarkerAlt /> {c.currentLocation || 'Location not provided'}
                                                </div>
                                            </div>
                                            <div className="card-footer-actions">
                                                <button
                                                    className="view-profile-btn-full"
                                                    onClick={() => navigate(`/company/candidate/${c.id}`)}
                                                >
                                                    View Profile <FaChevronRight />
                                                </button>
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
    );
};

export default FindCandidate;
