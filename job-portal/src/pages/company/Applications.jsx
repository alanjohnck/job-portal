import React, { useState } from 'react';
import CompanyNavbar from './components/CompanyNavbar';
import CompanySidebar from './components/CompanySidebar';
import { FaEllipsisH, FaDownload, FaPlus, FaChevronRight, FaEdit, FaTrashAlt } from 'react-icons/fa';
import './Applications.css';

const Applications = () => {
    const [columns, setColumns] = useState([
        {
            title: 'All Application',
            count: 213,
            applications: [
                {
                    id: 1,
                    name: 'Ronald Richards',
                    initials: 'RR',
                    role: 'UI/UX Designer',
                    exp: '7 Years Experience',
                    edu: 'Master Degree',
                    applied: 'Jan 23, 2022',
                    image: 'https://ui-avatars.com/api/?name=Ronald+Richards&background=7c3aed&color=fff'
                },
                {
                    id: 2,
                    name: 'Theresa Webb',
                    initials: 'TW',
                    role: 'Product Designer',
                    exp: '2 Years Experience',
                    edu: 'High School Degree',
                    applied: 'Jan 23, 2022',
                    image: 'https://ui-avatars.com/api/?name=Theresa+Webb&background=7c3aed&color=fff'
                },
                {
                    id: 3,
                    name: 'Devon Lane',
                    initials: 'DL',
                    role: 'User Experience Designer',
                    exp: '7 Years Experience',
                    edu: 'Master Degree',
                    applied: 'Jan 23, 2022',
                    image: 'https://ui-avatars.com/api/?name=Devon+Lane&background=7c3aed&color=fff'
                }
            ]
        },
        {
            title: 'Shortlisted',
            count: 2,
            applications: [
                {
                    id: 4,
                    name: 'Darrell Steward',
                    initials: 'DS',
                    role: 'UI/UX Designer',
                    exp: '7 Years Experience',
                    edu: 'Intermediate Degree',
                    applied: 'Jan 23, 2022',
                    image: 'https://ui-avatars.com/api/?name=Darrell+Steward&background=7c3aed&color=fff'
                },
                {
                    id: 5,
                    name: 'Jenny Wilson',
                    initials: 'JW',
                    role: 'UI Designer',
                    exp: '7 Years Experience',
                    edu: 'Bachelor Degree',
                    applied: 'Jan 23, 2022',
                    image: 'https://ui-avatars.com/api/?name=Jenny+Wilson&background=7c3aed&color=fff'
                }
            ]
        }
    ]);

    const [showSort, setShowSort] = useState(false);
    const [activeColMenu, setActiveColMenu] = useState(null);

    return (
        <div className="comp-layout">
            <CompanyNavbar />
            <div className="comp-container">
                <div className="container comp-flex">
                    <CompanySidebar />

                    <main className="comp-main-content">
                        <nav className="breadcrumb">
                            <span>Home</span> <FaChevronRight size={10} />
                            <span>Job</span> <FaChevronRight size={10} />
                            <span>Senior UI/UX Designer</span> <FaChevronRight size={10} />
                            <span className="active">Applications</span>
                        </nav>

                        <div className="apps-page-header">
                            <h1>Job Applications</h1>
                            <div className="header-actions">
                                <span className="filter-text">Filter</span>
                                <div className="sort-container">
                                    <button className="sort-btn" onClick={() => setShowSort(!showSort)}>
                                        Sort <span className="active-sort">Newest</span>
                                    </button>
                                    {showSort && (
                                        <div className="sort-dropdown">
                                            <p className="dropdown-title">SORT APPLICATION</p>
                                            <label className="sort-option">
                                                <input type="radio" name="sort" defaultChecked />
                                                <span>Newest</span>
                                            </label>
                                            <label className="sort-option">
                                                <input type="radio" name="sort" />
                                                <span>Oldest</span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="kanban-wrapper">
                            {columns.map((column, colIdx) => (
                                <div key={colIdx} className="kanban-column">
                                    <div className="column-header">
                                        <h3>{column.title} ({column.count})</h3>
                                        <div className="col-menu-wrap">
                                            <button className="col-more-btn" onClick={() => setActiveColMenu(activeColMenu === colIdx ? null : colIdx)}>
                                                <FaEllipsisH />
                                            </button>
                                            {activeColMenu === colIdx && (
                                                <div className="col-dropdown">
                                                    <button><FaEdit /> Edit Column</button>
                                                    <button className="delete"><FaTrashAlt /> Delete</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="cards-container">
                                        {column.applications.map((app) => (
                                            <div key={app.id} className="app-card-premium">
                                                <div className="card-top">
                                                    <div className="candidate-avatar initials-box">
                                                        {app.initials}
                                                    </div>
                                                    <div className="candidate-info">
                                                        <h4>{app.name}</h4>
                                                        <p>{app.role}</p>
                                                    </div>
                                                </div>
                                                <div className="card-details">
                                                    <div className="detail-item">
                                                        <span className="dot"></span> {app.exp}
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="dot"></span> Education: {app.edu}
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="dot"></span> Applied: {app.applied}
                                                    </div>
                                                </div>
                                                <div className="card-footer">
                                                    <button className="download-cv-btn">
                                                        <FaDownload /> Download Cv
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button className="create-column-btn">
                                <FaPlus /> Create Column
                            </button>
                        </div>

                        <footer className="comp-footer-minimal">
                            <p>© 2021 Jobpilot - Job Board. All rights Reserved</p>
                        </footer>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Applications;
