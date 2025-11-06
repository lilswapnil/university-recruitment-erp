import React, { useState, useEffect } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { Application, Job } from '../../types';
import api from '../../api';
import Modal from '../Modal';

interface CandidateDashboardProps {
  onViewChange: (view: string, data?: any) => void;
}

const CandidateDashboard: React.FC<CandidateDashboardProps> = ({ onViewChange }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, jobsRes] = await Promise.all([
          api.get('/applications/'),
          api.get('/jobs/'),
        ]);
        setApplications(appsRes.data);
        setJobs(jobsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleApply = async () => {
    if (!selectedJob) return;
    try {
      await api.post('/applications/', {
        job: Number(selectedJob),
        status: 'Received',
      });
      setIsModalOpen(false);
      setSelectedJob('');
      // Refresh applications
      const response = await api.get('/applications/');
      setApplications(response.data);
    } catch (error: any) {
      console.error('Error applying:', error);
      alert(error.response?.data?.error || 'Failed to submit application');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 size={24} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  const myApplications = applications;
  const statusCounts = {
    received: myApplications.filter(app => app.status === 'Received').length,
    review: myApplications.filter(app => app.status === 'Under Review').length,
    interview: myApplications.filter(app => app.status === 'Interview').length,
    offer: myApplications.filter(app => app.status === 'Offer Extended').length,
    rejected: myApplications.filter(app => app.status === 'Rejected').length,
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">My Applications</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 flex items-center gap-1"
          >
            <Plus size={14} />
            Apply to Job
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2">
          <div className="text-center p-2 bg-blue-50 rounded">
            <p className="text-lg font-bold text-blue-600">{statusCounts.received}</p>
            <p className="text-xs text-gray-600">Received</p>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded">
            <p className="text-lg font-bold text-yellow-600">{statusCounts.review}</p>
            <p className="text-xs text-gray-600">Review</p>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded">
            <p className="text-lg font-bold text-purple-600">{statusCounts.interview}</p>
            <p className="text-xs text-gray-600">Interview</p>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <p className="text-lg font-bold text-green-600">{statusCounts.offer}</p>
            <p className="text-xs text-gray-600">Offer</p>
          </div>
          <div className="text-center p-2 bg-red-50 rounded">
            <p className="text-lg font-bold text-red-600">{statusCounts.rejected}</p>
            <p className="text-xs text-gray-600">Rejected</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800">Application History</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {myApplications.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">
              No applications yet. Apply to a job to get started!
            </div>
          ) : (
            myApplications.map((app) => (
              <div key={app.id} className="p-3 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{app.job_title}</p>
                    <p className="text-xs text-gray-600">{app.job_department}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Applied: {new Date(app.applicationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    app.status === 'Offer Extended' ? 'bg-green-100 text-green-800' :
                    app.status === 'Interview' ? 'bg-purple-100 text-purple-800' :
                    app.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                    app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Apply to Job">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Select Job</label>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Choose a job...</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title} - {job.department}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!selectedJob}
              className="flex-1 px-3 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              Apply
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CandidateDashboard;
