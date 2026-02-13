import React, { useState, useEffect } from 'react';
import './FindCompanies.css';
import Header from './components/Header';
import CompanyCard from './components/CompanyCard';
import { getCompanies } from '../../services/api';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const FindCompanies = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = 12;

    useEffect(() => {
        fetchCompanies();
    }, [currentPage, searchTerm]);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await getCompanies(searchTerm, null, currentPage, pageSize);
            
            if (response.success && response.data) {
                setCompanies(response.data.items || []);
                setTotalPages(response.data.pagination?.totalPages || 1);
                setTotalItems(response.data.pagination?.totalItems || 0);
            } else {
                setError('Failed to load companies');
            }
        } catch (err) {
            console.error('Error fetching companies:', err);
            setError('Failed to load companies');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        
        return pages;
    };

    return (
        <div className="find-companies-page">
            <Header />

            <main className="container companies-content">
                <div className="content-header">
                    <div className="header-text">
                        <h2>Top Companies</h2>
                        <p>{totalItems} companies hiring top talent</p>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-message">Loading companies...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : companies.length === 0 ? (
                    <div className="empty-state">
                        <p>No companies found. Try adjusting your search.</p>
                    </div>
                ) : (
                    <>
                        <div className="companies-grid">
                            {companies.map(company => (
                                <CompanyCard key={company.id} company={company} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="pagination-v2">
                                <button 
                                    className="pg-arrow" 
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <FaChevronLeft />
                                </button>
                                
                                {getPageNumbers().map(pageNum => (
                                    <button
                                        key={pageNum}
                                        className={`pg-num ${currentPage === pageNum ? 'active' : ''}`}
                                        onClick={() => handlePageChange(pageNum)}
                                    >
                                        {pageNum}
                                    </button>
                                ))}
                                
                                <button 
                                    className="pg-arrow" 
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default FindCompanies;
