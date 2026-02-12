import React, { useState } from 'react';
import './FindCompanies.css';
import Header from './components/Header';
import CompanyCard from './components/CompanyCard';
import { companies } from './data/companies';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const FindCompanies = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="find-companies-page">
            <Header />

            <main className="container companies-content">
                <div className="content-header">
                    <div className="header-text">
                        <h2>Top Companies</h2>
                        <p>{companies.length} companies hiring top talent</p>
                    </div>
                </div>

                <div className="companies-grid">
                    {filteredCompanies.map(company => (
                        <CompanyCard key={company.id} company={company} />
                    ))}
                </div>

                <div className="pagination-v2">
                    <button className="pg-arrow"><FaChevronLeft /></button>
                    <button className="pg-num active">1</button>
                    <button className="pg-num">2</button>
                    <button className="pg-num">3</button>
                    <button className="pg-arrow"><FaChevronRight /></button>
                </div>
            </main>
        </div>
    );
};

export default FindCompanies;
