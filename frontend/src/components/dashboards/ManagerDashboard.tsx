import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Application } from '../../types';
import api from '../../api';

interface ManagerDashboardProps {
  onViewChange: (view: string, data?: any) => void;
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ onViewChange }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params: any = {};
        if (statusFilter !== 'all') params.status = statusFilter;
        const response = await api.get('/applications/', { params });
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [statusFilter]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 size={24} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  const totalApplications = applications.length;
  const pendingReview = applications.filter(app => app.status === 'Under Review').length;
  const interviews = applications.filter(app => app.status === 'Interview').length;
  const offers = applications.filter(app => app.status === 'Offer Extended').length;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-3 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800 mb-3">Manager Dashboard</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Applications</option>
          <option value="Under Review">Under Review</option>
          <option value="Interview">Interview</option>
          <option value="Offer Extended">Offer Extended</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-xs text-gray-600 mb-1">Total Applications</p>
          <p className="text-xl font-bold text-gray-800">{totalApplications}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-xs text-gray-600 mb-1">Pending Review</p>
          <p className="text-xl font-bold text-yellow-600">{pendingReview}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-xs text-gray-600 mb-1">Interviews</p>
          <p className="text-xl font-bold text-purple-600">{interviews}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-xs text-gray-600 mb-1">Offers Extended</p>
          <p className="text-xl font-bold text-green-600">{offers}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800">Recent Applications</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {applications.slice(0, 10).map((app) => (
            <div key={app.id} className="p-3 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{app.job_title}</p>
                  <p className="text-xs text-gray-600">{app.candidate_name}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  app.status === 'Offer Extended' ? 'bg-green-100 text-green-800' :
                  app.status === 'Interview' ? 'bg-purple-100 text-purple-800' :
                  app.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;

