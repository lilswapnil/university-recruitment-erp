import React, { useState, useEffect } from 'react';
import { UserPlus, Loader2, Mail, Eye } from 'lucide-react';
import { Candidate } from '../types';
import api from '../api';
import Modal from './ui/Modal';

interface Props {
  onSelectCandidate: (candidate: Candidate) => void;
}

const Candidates: React.FC<Props> = ({ onSelectCandidate }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  // Form state
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/candidates/');
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingForm(true);
    try {
      const response = await api.post('/candidates/', { fName, lName, email, phone });
      setCandidates([...candidates, response.data]);
      setIsModalOpen(false);
      // Reset form
      setFName("");
      setLName("");
      setEmail("");
      setPhone("");
    } catch (error) {
      console.error("Error adding candidate:", error);
    }
    setIsLoadingForm(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Candidate">
        <form onSubmit={handleSubmit}>
          {/* Form fields... */}
          <div className="mb-4">
            <label htmlFor="fName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input type="text" id="fName" value={fName} onChange={e => setFName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="lName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input type="text" id="lName" value={lName} onChange={e => setLName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          {/* Form buttons... */}
          <div className="flex gap-2 mt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isLoadingForm} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300">
              {isLoadingForm ? <Loader2 size={20} className="animate-spin" /> : "Add Candidate"}
            </button>
          </div>
        </form>
      </Modal>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Candidates</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 text-sm font-medium"
        >
          <UserPlus size={16} /> New Candidate
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 size={32} className="animate-spin text-indigo-600" />
        </div>
      ) : (
        <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {candidates.length === 0 ? (
            <p className="text-gray-500">No candidates found.</p>
          ) : (
            candidates.map(candidate => (
              <li key={candidate.id} className="p-4 border border-gray-200 rounded-md flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{candidate.fName} {candidate.lName}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Mail size={14} className="text-gray-400" /> {candidate.email}
                  </p>
                </div>
                <button
                  onClick={() => onSelectCandidate(candidate)}
                  className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-50 text-sm"
                >
                  <Eye size={16} /> View
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default Candidates;
