import React, { useState, useEffect } from 'react';
import './FindJobs.css';
import Header from './components/Header';
import JobCard from './components/JobCard';
import { FaThLarge, FaList, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import JobFilter from './components/JobFilter';
import { getJobs } from '../../services/api';

const FindJobs = () => {
  const [view, setView] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await getJobs({ ...filters, page, pageSize: 12 });
        if (response && response.items) {
          const mappedJobs = response.items.map(job => ({
            id: job.id,
            title: job.title,
            company: job.company?.name || 'Unknown',
            logo: job.company?.logo, // Ensure this URL is accessible or handle fallback in JobCard
            location: job.location,
            type: job.jobType,
            salary: formatSalary(job.minSalary, job.maxSalary, job.salaryCurrency),
            posted: formatDate(job.createdAt),
            level: job.experienceLevel,
            education: job.education,
            experience: job.experience
          }));
          setJobs(mappedJobs);
          setTotalPages(response.pagination?.totalPages || 1);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [page, filters]);

  const formatSalary = (min, max, currency) => {
    if (!min && !max) return 'Negotiable';
    const curr = currency === 'USD' ? '$' : currency;
    if (min && max) return `${curr}${min / 1000}k - ${curr}${max / 1000}k`;
    if (min) return `${curr}${min / 1000}k+`;
    return `Up to ${curr}${max / 1000}k`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const applyFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
    setShowFilters(false); // Close sidebar on mobile after apply
  };

  const handleSearch = ({ keyword, location }) => {
    setFilters(prev => ({ ...prev, keyword, location }));
    setPage(1);
  };

  return (
    <div className="find-jobs-page">
      <Header onSearch={handleSearch} />

      <main className="container jobs-content">
        <div className={`find-jobs-layout ${showFilters ? 'filters-expanded' : ''}`}>
          <aside className={`filters-sidebar-wrapper ${showFilters ? 'visible' : ''}`}>
            <JobFilter onClose={() => setShowFilters(false)} onApply={applyFilters} />
          </aside>

          <div className="jobs-main-column">
            <div className="content-header">
              <div className="header-text">
                <h2>Recommended Jobs</h2>
                <p>{jobs.length} jobs shown</p>
              </div>

              <div className="view-actions">
                <button
                  className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FaList style={{ transform: 'rotate(90deg)', marginRight: '8px' }} /> Filter
                </button>
                <div className="divider"></div>
                <button
                  onClick={() => setView('grid')}
                  className={`view-btn ${view === 'grid' ? 'active' : ''}`}
                  title="Grid View"
                >
                  <FaThLarge />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`view-btn ${view === 'list' ? 'active' : ''}`}
                  title="List View"
                >
                  <FaList />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading-spinner">Loading jobs...</div>
            ) : (
              <>
                <div className={`job-listings-wrapper ${view}`}>
                  {jobs.length > 0 ? (
                    jobs.map(job => (
                      <JobCard key={job.id} job={job} view={view} />
                    ))
                  ) : (
                    <p>No jobs found matching your criteria.</p>
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="pagination-v2">
                    <button
                      className="pg-arrow"
                      disabled={page === 1}
                      onClick={() => handlePageChange(page - 1)}
                    >
                      <FaChevronLeft />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        className={`pg-num ${p === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(p)}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      className="pg-arrow"
                      disabled={page === totalPages}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FindJobs;