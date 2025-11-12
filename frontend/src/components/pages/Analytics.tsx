import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  FileText, 
  Clock,
  Award,
  Target
} from 'lucide-react';
import ChartCard from '../ui/ChartCard';
import DashboardCard from '../ui/DashboardCard';
import api from '../../api';

interface AnalyticsData {
  totalCandidates: number;
  totalApplications: number;
  activeJobs: number;
  hireRate: number;
  averageTimeToHire: number;
  monthlyApplications: number[];
  departmentStats: Array<{
    department: string;
    applications: number;
    hired: number;
  }>;
  sourceStats: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch data from multiple endpoints
      const [candidatesRes, applicationsRes, jobsRes] = await Promise.all([
        api.get('/candidates/'),
        api.get('/applications/'),
        api.get('/jobs/')
      ]);

      const candidates = candidatesRes.data;
      const applications = applicationsRes.data;
      const jobs = jobsRes.data;

      // Calculate analytics
      const totalCandidates = candidates.length;
      const totalApplications = applications.length;
      const activeJobs = jobs.filter((job: any) => job.status === 'Active').length;
      
      const hiredApplications = applications.filter((app: any) => app.status === 'Offer Extended').length;
      const hireRate = totalApplications > 0 ? (hiredApplications / totalApplications) * 100 : 0;
      
      // Mock monthly applications data for chart
      const monthlyApplications = [120, 135, 148, 162, 175, 189, 203, 218, 232, 245, 258, 272];
      
      // Department stats
      const departmentCounts: { [key: string]: { applications: number; hired: number } } = {};
      applications.forEach((app: any) => {
        const dept = app.job?.department || 'Other';
        if (!departmentCounts[dept]) {
          departmentCounts[dept] = { applications: 0, hired: 0 };
        }
        departmentCounts[dept].applications++;
        if (app.status === 'Offer Extended') {
          departmentCounts[dept].hired++;
        }
      });

      const departmentStats = Object.entries(departmentCounts).map(([dept, stats]) => ({
        department: dept,
        applications: stats.applications,
        hired: stats.hired
      }));

      // Source stats (mock data)
      const sourceStats = [
        { source: 'Company Website', count: 45, percentage: 35 },
        { source: 'LinkedIn', count: 38, percentage: 30 },
        { source: 'Job Boards', count: 25, percentage: 20 },
        { source: 'Referrals', count: 19, percentage: 15 }
      ];

      setAnalyticsData({
        totalCandidates,
        totalApplications,
        activeJobs,
        hireRate,
        averageTimeToHire: 14, // Mock data
        monthlyApplications,
        departmentStats,
        sourceStats
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <DashboardCard
              key={i}
              title=""
              value=""
              icon={TrendingUp}
              loading={true}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load analytics data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Comprehensive recruitment insights and metrics</p>
        </div>
        
        {/* Period Selector */}
        <div className="flex items-center space-x-2">
          {(['7d', '30d', '90d'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                selectedPeriod === period
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {period === '7d' ? 'Last 7 days' : period === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Applications"
          value={analyticsData.totalApplications.toString()}
          icon={FileText}
          color="blue"
          change={{ type: 'increase', value: 12, period: 'last month' }}
        />
        
        <DashboardCard
          title="Active Candidates"
          value={analyticsData.totalCandidates.toString()}
          icon={Users}
          color="green"
          change={{ type: 'increase', value: 8, period: 'last month' }}
        />
        
        <DashboardCard
          title="Open Positions"
          value={analyticsData.activeJobs.toString()}
          icon={Briefcase}
          color="purple"
          change={{ type: 'decrease', value: 3, period: 'last month' }}
        />
        
        <DashboardCard
          title="Hire Rate"
          value={`${analyticsData.hireRate.toFixed(1)}%`}
          icon={Award}
          color="orange"
          change={{ type: 'increase', value: 5, period: 'last month' }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Application Trends */}
        <div className="workday-card">
          <div className="workday-card-header">
            <h3 className="text-lg font-semibold text-gray-900">Application Trends</h3>
            <p className="text-sm text-gray-500">Monthly application volume over time</p>
          </div>
          <ChartCard
            title="Applications"
            data={analyticsData.monthlyApplications.map((value, index) => ({
              day: index + 1,
              current: value,
              previous: value - 10
            }))}
          />
        </div>

        {/* Department Performance */}
        <div className="workday-card">
          <div className="workday-card-header">
            <h3 className="text-lg font-semibold text-gray-900">Department Performance</h3>
            <p className="text-sm text-gray-500">Applications and hires by department</p>
          </div>
          <div className="space-y-4">
            {analyticsData.departmentStats.map((dept) => (
              <div key={dept.department} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{dept.department}</h4>
                  <p className="text-sm text-gray-500">{dept.applications} applications</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{dept.hired}</p>
                  <p className="text-sm text-gray-500">hired</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Application Sources */}
        <div className="workday-card">
          <div className="workday-card-header">
            <h3 className="text-lg font-semibold text-gray-900">Application Sources</h3>
            <p className="text-sm text-gray-500">Where candidates are coming from</p>
          </div>
          <div className="space-y-3">
            {analyticsData.sourceStats.map((source) => (
              <div key={source.source} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{source.source}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8">{source.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Metrics */}
        <div className="workday-card">
          <div className="workday-card-header">
            <h3 className="text-lg font-semibold text-gray-900">Time Metrics</h3>
            <p className="text-sm text-gray-500">Average processing times</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{analyticsData.averageTimeToHire} days</p>
                <p className="text-sm text-gray-500">Average time to hire</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">3.2 days</p>
                <p className="text-sm text-gray-500">Average response time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="workday-card">
          <div className="workday-card-header">
            <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
            <p className="text-sm text-gray-500">Key performance indicators</p>
          </div>
          <div className="space-y-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">92%</p>
              <p className="text-sm text-gray-600">Interview Show Rate</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">4.7</p>
              <p className="text-sm text-gray-600">Candidate Experience Rating</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">67%</p>
              <p className="text-sm text-gray-600">Offer Acceptance Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;