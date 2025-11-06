import React, { useState, useEffect, useCallback } from 'react';
import { Mail, Phone, Plus, Loader2 } from 'lucide-react';
import { Candidate, Job, Application } from '../types';
import api from '../api';
import Modal from './Modal';

interface Props {
  candidate: Candidate;
  allJobs: Job[];
  onBack: () => void;
}

const CandidateProfile: React.FC<Props> = ({ candidate, allJobs, onBack }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  // Application form state
  const [jobId, setJobId] = useState<string>(allJobs.length > 0 ? String(allJobs[0].id) : "");

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/applications/?candidate_id=${candidate.id}`);
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
    setIsLoading(false);
  }, [candidate.id]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId) return;
    setIsLoadingForm(true);
    try {
      await api.post('/applications/', {
        candidate: candidate.id,
        job: Number(jobId),
        status: "Received", // Default status
      });
      // After POST, the response only has IDs. We need to refetch to get populated names.
      fetchApplications();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting application:", error);
    }
    setIsLoadingForm(false);
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
        case 'Received': return 'bg-blue-100 text-blue-800';
        case 'Under Review': return 'bg-yellow-100 text-yellow-800';
        case 'Interview': return 'bg-purple-100 text-purple-800';
        case 'Offer Extended': return 'bg-green-100 text-green-800';
        case 'Rejected': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Apply ${candidate.fName} to Job`}>
        <form onSubmit={handleAppSubmit}>
          <div className="mb-4">
            <label htmlFor="job" className="block text-sm font-medium text-gray-700 mb-1">Select Job Opening</label>
            <select
              id="job"
              value={jobId}
              onChange={e => setJobId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {allJobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title} ({job.department})
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isLoadingForm} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300">
              {isLoadingForm ? <Loader2 size={20} className="animate-spin" /> : "Submit Application"}
            </button>
          </div>
        </form>
      </Modal>

      <button onClick={onBack} className="text-sm text-indigo-600 hover:text-indigo-800 mb-4">&larr; Back to Dashboard</button>
      
      {/* Candidate Header */}
      <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{candidate.fName} {candidate.lName}</h2>
          <p className="text-md text-gray-600 flex items-center gap-2 mt-1">
            <Mail size={16} className="text-gray-400" /> {candidate.email}
          </p>
          <p className="text-md text-gray-600 flex items-center gap-2 mt-1">
            <Phone size={16} className="text-gray-400" /> {candidate.phone || 'N/A'}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 text-sm font-medium"
        >
          <Plus size={16} /> Apply to Job
        </button>
      </div>

      {/* Applications List */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Applications</h3>
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 size={32} className="animate-spin text-indigo-600" />
        </div>
      ) : (
        <ul className="space-y-3">
          {applications.length === 0 ? (
            <p className="text-gray-500">This candidate has not applied for any jobs yet.</p>
          ) : (
            applications.map(app => (
              <li key={app.id} className="p-4 border border-gray-200 rounded-md flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{app.job_title}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Applied: {new Date(app.applicationDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default CandidateProfile;
