import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  FileText, 
  Clock, 
  TrendingUp, 
  UserCheck, 
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Plus
} from 'lucide-react';
import api from '../../api';

interface HRDashboardProps {
  onViewChange: (view: string, data?: any) => void;
}

const HRDashboard: React.FC<HRDashboardProps> = ({ onViewChange }) => {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingReviews: 0,
    interviewsToday: 0,
    offersExtended: 0,
    applicationsByStatus: {} as Record<string, number>,
    recentActivity: [] as any[],
    loading: true
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [candidatesRes, jobsRes, applicationsRes] = await Promise.all([
        api.get('/candidates/'),
        api.get('/jobs/'),
        api.get('/applications/')
      ]);

      const candidates = candidatesRes.data;
      const jobs = jobsRes.data;
      const applications = applicationsRes.data;

      // Calculate application stats by status
      const statusCounts = applications.reduce((acc: Record<string, number>, app: any) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalCandidates: candidates.length,
        activeJobs: jobs.length,
        totalApplications: applications.length,
        pendingReviews: statusCounts['Under Review'] || 0,
        interviewsToday: statusCounts['Interview'] || 0,
        offersExtended: statusCounts['Offer Extended'] || 0,
        applicationsByStatus: statusCounts,
        recentActivity: applications.slice(0, 10),
        loading: false
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Received': return <Clock className="h-4 w-4" />;
      case 'Under Review': return <Eye className="h-4 w-4" />;
      case 'Interview': return <Calendar className="h-4 w-4" />;
      case 'Offer Extended': return <CheckCircle className="h-4 w-4" />;
      case 'Rejected': return <XCircle className="h-4 w-4" />;
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

  if (stats.loading) {
    return (
      <div className="workday-main">
        <div className="dashboard-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="workday-card animate-pulse">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
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
          <h1 className="text-3xl font-bold text-gray-900">HR Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Monitor recruitment metrics and manage the hiring pipeline
          </p>
        </div>
        <button
          onClick={() => onViewChange('jobs')}
          className="workday-button-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>New Job Opening</span>
        </button>
      </div>

      {/* Key Metrics Grid */}
      <div className="dashboard-grid">
        {/* Total Candidates */}
        <div 
          className="workday-card cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={() => onViewChange('candidates')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Total Candidates
                </h3>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {stats.totalCandidates.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Active Jobs */}
        <div 
          className="workday-card cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={() => onViewChange('jobs')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Active Jobs
                </h3>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {stats.activeJobs}
                </p>
              </div>
            </div>
            <div className="text-green-600">
              <Target className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Total Applications */}
        <div 
          className="workday-card cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={() => onViewChange('applications')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Total Applications
                </h3>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {stats.totalApplications.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-purple-600">
              <FileText className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="workday-card bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-yellow-700 uppercase tracking-wide">
                  Pending Reviews
                </h3>
                <p className="text-2xl font-semibold text-yellow-900 mt-1">
                  {stats.pendingReviews}
                </p>
              </div>
            </div>
            <div className="text-yellow-600">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Interviews Today */}
        <div className="workday-card bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-700 uppercase tracking-wide">
                  Interviews Today
                </h3>
                <p className="text-2xl font-semibold text-blue-900 mt-1">
                  {stats.interviewsToday}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Offers Extended */}
        <div className="workday-card bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-green-700 uppercase tracking-wide">
                  Offers Extended
                </h3>
                <p className="text-2xl font-semibold text-green-900 mt-1">
                  {stats.offersExtended}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="workday-card">
          <div className="workday-card-header">
            <h2 className="text-lg font-semibold text-gray-900">Application Status Distribution</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(stats.applicationsByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{status}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-semibold text-gray-900">{count}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getStatusColor(status).replace('text-', 'bg-').replace('bg-', 'bg-').replace('-50', '-500')}`}
                      style={{ width: `${(count / stats.totalApplications) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 w-12">
                    {Math.round((count / stats.totalApplications) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="workday-card">
          <div className="workday-card-header">
            <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
          </div>
          <div className="space-y-4">
            {stats.recentActivity.slice(0, 8).map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                    {getStatusIcon(activity.status)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.candidate_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.job_title} • {activity.job_department}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.applicationDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {stats.recentActivity.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p>No recent applications</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="workday-card">
        <div className="workday-card-header">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onViewChange('jobs')}
            className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200"
          >
            <Plus className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700">Create Job Opening</p>
          </button>
          
          <button
            onClick={() => onViewChange('applications')}
            className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors duration-200"
          >
            <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700">Review Applications</p>
          </button>
          
          <button
            onClick={() => onViewChange('candidates')}
            className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors duration-200"
          >
            <Users className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700">Browse Candidates</p>
          </button>
          
          <button
            onClick={() => onViewChange('reporting')}
            className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors duration-200"
          >
            <TrendingUp className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700">View Reports</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;

