import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  Calendar, 
  CheckCircle, 
  Users, 
  Briefcase,
  TrendingUp,
  Eye,
  Filter
} from 'lucide-react';
import DashboardCard from '../DashboardCard';
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

  const totalApplications = applications.length;
  const pendingReview = applications.filter(app => app.status === 'Under Review').length;
  const interviews = applications.filter(app => app.status === 'Interview').length;
  const offers = applications.filter(app => app.status === 'Offer Extended').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Received': return <Clock className="h-4 w-4" />;
      case 'Under Review': return <Eye className="h-4 w-4" />;
      case 'Interview': return <Calendar className="h-4 w-4" />;
      case 'Offer Extended': return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Received': return 'text-blue-600 bg-blue-50';
      case 'Under Review': return 'text-yellow-600 bg-yellow-50';
      case 'Interview': return 'text-purple-600 bg-purple-50';
      case 'Offer Extended': return 'text-green-600 bg-green-50';
      case 'Rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="workday-main">
        <div className="dashboard-grid">
          {[1, 2, 3, 4].map((i) => (
            <DashboardCard
              key={i}
              title=""
              value=""
              icon={FileText}
              loading={true}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Review applications and manage the hiring process for your team
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="workday-input"
            >
              <option value="all">All Applications</option>
              <option value="Under Review">Under Review</option>
              <option value="Interview">Interview</option>
              <option value="Offer Extended">Offer Extended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="dashboard-grid">
        <DashboardCard
          title="Total Applications"
          value={totalApplications}
          icon={FileText}
          color="blue"
          onClick={() => onViewChange('applications')}
          change={{
            value: 8.2,
            type: 'increase',
            period: 'last month'
          }}
        />
        
        <DashboardCard
          title="Pending Review"
          value={pendingReview}
          icon={Clock}
          color="orange"
          subtitle="Require attention"
          change={{
            value: 2.1,
            type: 'decrease',
            period: 'last week'
          }}
        />
        
        <DashboardCard
          title="Interviews Scheduled"
          value={interviews}
          icon={Calendar}
          color="purple"
          subtitle="This week"
          change={{
            value: 15.3,
            type: 'increase',
            period: 'last week'
          }}
        />
        
        <DashboardCard
          title="Offers Extended"
          value={offers}
          icon={CheckCircle}
          color="green"
          subtitle="Awaiting response"
          change={{
            value: 12.5,
            type: 'increase',
            period: 'last month'
          }}
        />
      </div>

      {/* Applications Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Applications List */}
        <div className="xl:col-span-2 workday-card">
          <div className="workday-card-header">
            <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
            <button 
              onClick={() => onViewChange('applications')}
              className="workday-button-secondary"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {applications.slice(0, 8).map((app) => (
              <div key={app.id} className="py-4 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{app.candidate_name}</p>
                      <p className="text-sm text-gray-500">{app.job_title}</p>
                      <p className="text-xs text-gray-400">{app.job_department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(app.applicationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {applications.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p>No applications found</p>
                <p className="text-sm">Applications will appear here as they are submitted</p>
              </div>
            )}
          </div>
        </div>

        {/* Application Status Summary */}
        <div className="workday-card">
          <div className="workday-card-header">
            <h2 className="text-lg font-semibold text-gray-900">Application Pipeline</h2>
          </div>
          <div className="space-y-6">
            {/* Status Breakdown */}
            {Object.entries(
              applications.reduce((acc: Record<string, number>, app) => {
                acc[app.status] = (acc[app.status] || 0) + 1;
                return acc;
              }, {})
            ).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{status}</p>
                    <p className="text-xs text-gray-500">
                      {Math.round((count / totalApplications) * 100)}% of total
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{count}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => onViewChange('applications', { status: 'Under Review' })}
                className="w-full workday-button-secondary flex items-center justify-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>Review Applications</span>
              </button>
              <button
                onClick={() => onViewChange('applications', { status: 'Interview' })}
                className="w-full workday-button-secondary flex items-center justify-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Schedule Interviews</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="workday-card">
        <div className="workday-card-header">
          <h2 className="text-lg font-semibold text-gray-900">Team Performance</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">{totalApplications}</p>
            <p className="text-sm text-gray-500">Applications Reviewed</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">{Math.round((offers / totalApplications) * 100)}%</p>
            <p className="text-sm text-gray-500">Conversion Rate</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
              <Briefcase className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">{Math.round(totalApplications / 30)}</p>
            <p className="text-sm text-gray-500">Avg Daily Applications</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;

