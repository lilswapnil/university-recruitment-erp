import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/pages/LoginPage';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import HRDashboard from './components/dashboards/HRDashboard';
import ManagerDashboard from './components/dashboards/ManagerDashboard';
import CandidateDashboard from './components/dashboards/CandidateDashboard';
import JobOpenings from './components/JobOpenings';
import Candidates from './components/Candidates';
import CandidateProfile from './components/CandidateProfile';
import ApplicationsView from './components/ApplicationsView';
import Analytics from './components/pages/Analytics';
import Interviews from './components/pages/Interviews';
import Reports from './components/pages/Reports';
import Settings from './components/pages/Settings';
import TeamAnalytics from './components/pages/TeamAnalytics';
import MyTeam from './components/pages/MyTeam';
import Profile from './components/pages/Profile';
import JobSearch from './components/pages/JobSearch';
import { Job, Candidate } from './types';
import api from './api';

function App() {
  const { user, loading } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchJobs = async () => {
        try {
          const response = await api.get('/jobs/');
          setJobs(response.data);
        } catch (error) {
          console.error('Error fetching jobs:', error);
        }
      };
      fetchJobs();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const handleViewChange = (view: string, data?: any) => {
    setActiveView(view);
    if (view === 'candidates' && data) {
      setSelectedCandidate(data);
      setActiveView('candidate-profile');
    }
  };

  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setActiveView('candidate-profile');
  };

  const handleBackToDashboard = () => {
    setSelectedCandidate(null);
    setActiveView('dashboard');
  };

  const renderDashboard = () => {
    switch (user.role) {
      case 'HR':
        return <HRDashboard onViewChange={handleViewChange} />;
      case 'MANAGER':
        return <ManagerDashboard onViewChange={handleViewChange} />;
      case 'CANDIDATE':
        return <CandidateDashboard onViewChange={handleViewChange} />;
      default:
        return <HRDashboard onViewChange={handleViewChange} />;
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return renderDashboard();
      
      // Common pages
      case 'jobs':
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Job Openings</h2>
            <JobOpenings initialJobs={jobs} onJobsChange={setJobs} />
          </div>
        );
      case 'applications':
        return <ApplicationsView userRole={user.role} />;
      case 'interviews':
        return <Interviews />;
      
      // HR-specific pages
      case 'analytics':
        if (user.role !== 'HR') {
          return <div className="text-center py-12 text-gray-600">Access denied. HR role required.</div>;
        }
        return <Analytics />;
      case 'candidates':
        if (user.role === 'CANDIDATE') {
          return <div className="text-center py-12 text-gray-600">Access denied.</div>;
        }
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Candidates</h2>
            <Candidates onSelectCandidate={handleSelectCandidate} />
          </div>
        );
      case 'reporting':
        if (user.role !== 'HR') {
          return <div className="text-center py-12 text-gray-600">Access denied. HR role required.</div>;
        }
        return <Reports />;
      case 'settings':
        if (user.role !== 'HR') {
          return <div className="text-center py-12 text-gray-600">Access denied. HR role required.</div>;
        }
        return <Settings />;
      
      // Manager-specific pages
      case 'team-analytics':
        if (user.role !== 'MANAGER') {
          return <div className="text-center py-12 text-gray-600">Access denied. Manager role required.</div>;
        }
        return <TeamAnalytics />;
      case 'team':
        if (user.role !== 'MANAGER') {
          return <div className="text-center py-12 text-gray-600">Access denied. Manager role required.</div>;
        }
        return <MyTeam />;
      
      // Candidate-specific pages
      case 'profile':
        if (user.role !== 'CANDIDATE') {
          return <div className="text-center py-12 text-gray-600">Access denied. Candidate role required.</div>;
        }
        return <Profile />;
      case 'job-search':
        if (user.role !== 'CANDIDATE') {
          return <div className="text-center py-12 text-gray-600">Access denied. Candidate role required.</div>;
        }
        return <JobSearch />;
      
      // Candidate profile view (for HR/Manager)
      case 'candidate-profile':
        if (user.role === 'CANDIDATE') {
          return <div className="text-center py-12 text-gray-600">Access denied.</div>;
        }
        return (
          <CandidateProfile
            candidate={selectedCandidate!}
            allJobs={jobs}
            onBack={handleBackToDashboard}
          />
        );
      
      default:
        return renderDashboard();
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="workday-layout min-h-screen">
      <Sidebar 
        activeView={activeView} 
        onViewChange={handleViewChange} 
        userRole={user.role} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <Header user={user} onMenuToggle={toggleSidebar} />
      <main className="workday-main">
        {renderContent()}
      </main>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
