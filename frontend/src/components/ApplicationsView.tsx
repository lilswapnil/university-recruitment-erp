import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Application } from '../types';
import api from '../api';

interface ApplicationsViewProps {
  userRole: string;
}

const ApplicationsView: React.FC<ApplicationsViewProps> = ({ userRole }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const params: any = {};
        if (statusFilter !== 'all') params.status = statusFilter;
        if (departmentFilter !== 'all') params.department = departmentFilter;
        
        const response = await api.get('/applications/', { params });
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
      setIsLoading(false);
    };
    fetchApplications();
  }, [statusFilter, departmentFilter]);

  // Get unique departments
  const departments = Array.from(new Set(applications.map(app => app.job_department)));

  // Categorize applications
  const categorizedApps = {
    all: applications,
    received: applications.filter(app => app.status === 'Received'),
    'under-review': applications.filter(app => app.status === 'Under Review'),
    interview: applications.filter(app => app.status === 'Interview'),
    'offer-extended': applications.filter(app => app.status === 'Offer Extended'),
    rejected: applications.filter(app => app.status === 'Rejected'),
  };

  const displayApps = selectedCategory === 'all' 
    ? applications 
    : categorizedApps[selectedCategory as keyof typeof categorizedApps] || [];

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 size={24} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Applications</h2>
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-lg p-2 shadow-sm flex gap-2 overflow-x-auto">
        {[
          { id: 'all', label: 'All', count: applications.length },
          { id: 'received', label: 'Received', count: categorizedApps.received.length },
          { id: 'under-review', label: 'Under Review', count: categorizedApps['under-review'].length },
          { id: 'interview', label: 'Interview', count: categorizedApps.interview.length },
          { id: 'offer-extended', label: 'Offer Extended', count: categorizedApps['offer-extended'].length },
          { id: 'rejected', label: 'Rejected', count: categorizedApps.rejected.length },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-3 shadow-sm flex gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="Received">Received</option>
          <option value="Under Review">Under Review</option>
          <option value="Interview">Interview</option>
          <option value="Offer Extended">Offer Extended</option>
          <option value="Rejected">Rejected</option>
        </select>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow-sm">
        {displayApps.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No applications found
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {displayApps.map((app) => (
              <div key={app.id} className="p-3 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-gray-900">{app.job_title}</h3>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{app.job_department}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{app.candidate_name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Applied: {new Date(app.applicationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsView;

