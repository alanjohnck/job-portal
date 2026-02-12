import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import FindJobs from './pages/candidate/FindJobs'
import FindCompanies from './pages/candidate/FindCompanies'
import Dashboard from './pages/candidate/Dashboard'
import CustomerSupport from './pages/candidate/CustomerSupport'
import CompanyDetails from './pages/candidate/CompanyDetails'
import JobDetails from './pages/candidate/JobDetails'
import MyProfile from './pages/candidate/MyProfile'
import CompanySetup from './pages/company/CompanySetup'
import CompanyDashboard from './pages/company/CompanyDashboard'
import PostJob from './pages/company/PostJob'
import MyJobs from './pages/company/MyJobs'
import Applications from './pages/company/Applications'
import SavedCandidates from './pages/company/SavedCandidates'
import FindCandidate from './pages/company/FindCandidate'
import MockTests from './pages/company/MockTests'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminCompanies from './pages/admin/AdminCompanies'
import AdminJobs from './pages/admin/AdminJobs'
import AdminSupport from './pages/admin/AdminSupport'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/candidate/find-jobs" element={<FindJobs />} />
        <Route path="/candidate/find-companies" element={<FindCompanies />} />
        <Route path="/candidate/dashboard" element={<Dashboard />} />
        <Route path="/candidate/customer-support" element={<CustomerSupport />} />
        <Route path="/candidate/company-details/:id" element={<CompanyDetails />} />
        <Route path="/candidate/job-details/:id" element={<JobDetails />} />
        <Route path="/candidate/profile" element={<MyProfile />} />
        <Route path="/company/setup" element={<CompanySetup />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/company/post-job" element={<PostJob />} />
        <Route path="/company/my-jobs" element={<MyJobs />} />
        <Route path="/company/applications" element={<Applications />} />
        <Route path="/company/saved-candidates" element={<SavedCandidates />} />
        <Route path="/company/find-candidate" element={<FindCandidate />} />
        <Route path="/company/mock-tests" element={<MockTests />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/companies" element={<AdminCompanies />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
        <Route path="/admin/support" element={<AdminSupport />} />
      </Routes>
    </BrowserRouter>
  )
}


export default App
