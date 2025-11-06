import React, { useState } from 'react';
import { Plus, Loader2, Building } from 'lucide-react';
import { Job } from '../types';
import api from '../api';
import Modal from './Modal';

interface Props {
  initialJobs: Job[];
  onJobsChange: (jobs: Job[]) => void;
}

const JobOpenings: React.FC<Props> = ({ initialJobs, onJobsChange }) => {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [positions, setPositions] = useState(1);
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingForm(true);
    try {
      const response = await api.post('/jobs/', {
        title,
        department,
        positions: Number(positions),
        description,
      });
      const newJob = response.data;
      const newJobs = [...jobs, newJob];
      setJobs(newJobs);
      onJobsChange(newJobs); // Update parent state
      setIsModalOpen(false);
      // Reset form
      setTitle("");
      setDepartment("");
      setPositions(1);
      setDescription("");
    } catch (error) {
      console.error("Error adding job:", error);
    }
    setIsLoadingForm(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Job Opening">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input type="text" id="jobTitle" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input type="text" id="department" value={department} onChange={e => setDepartment(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="positions" className="block text-sm font-medium text-gray-700 mb-1">Positions</label>
            <input type="number" id="positions" value={positions} onChange={e => setPositions(Number(e.target.value))} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div className="flex gap-2 mt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isLoadingForm} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300">
              {isLoadingForm ? <Loader2 size={20} className="animate-spin" /> : "Add Job"}
            </button>
          </div>
        </form>
      </Modal>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Job Openings</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 text-sm font-medium"
        >
          <Plus size={16} /> New Job
        </button>
      </div>
      
      <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {jobs.length === 0 ? (
          <p className="text-gray-500">No job openings found.</p>
        ) : (
          jobs.map(job => (
            <li key={job.id} className="p-4 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Building size={14} className="text-gray-400" /> {job.department}
                  </p>
                </div>
                <span className="text-sm text-gray-700">{job.positions} Position(s)</span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default JobOpenings;
