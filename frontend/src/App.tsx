import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HRDashboard from './components/dashboards/HRDashboard';
import ManagerDashboard from './components/dashboards/ManagerDashboard';
import CandidateDashboard from './components/dashboards/CandidateDashboard';
import JobOpenings from './components/JobOpenings';
import Candidates from './components/Candidates';
import CandidateProfile from './components/CandidateProfile';
import ApplicationsView from './components/ApplicationsView';
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
      case 'jobs':
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Job Openings</h2>
            <JobOpenings initialJobs={jobs} onJobsChange={setJobs} />
          </div>
        );
      case 'candidates':
        if (user.role === 'CANDIDATE') {
          return <div className="text-sm text-gray-600">You don't have access to this section.</div>;
        }
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Candidates</h2>
            <Candidates onSelectCandidate={handleSelectCandidate} />
          </div>
        );
      case 'candidate-profile':
        if (user.role === 'CANDIDATE') {
          return <div className="text-sm text-gray-600">You don't have access to this section.</div>;
        }
        return (
          <CandidateProfile
            candidate={selectedCandidate!}
            allJobs={jobs}
            onBack={handleBackToDashboard}
          />
        );
      case 'applications':
        return <ApplicationsView userRole={user.role} />;
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
