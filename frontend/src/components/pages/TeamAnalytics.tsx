import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Clock,
  Award,
  Target,
  Calendar,
  Briefcase,
  UserCheck
} from 'lucide-react';
import DashboardCard from '../ui/DashboardCard';
import ChartCard from '../ui/ChartCard';
import api from '../../api';

interface TeamAnalyticsData {
  teamMembers: number;
  activeRequisitions: number;
  totalApplications: number;
  averageTimeToHire: number;
  teamHireRate: number;
  monthlyApplications: number[];
  teamPerformance: Array<{
    member: string;
    role: string;
    applicationsReviewed: number;
    interviewsConducted: number;
    hiresCompleted: number;
  }>;
  requisitionProgress: Array<{
    position: string;
    department: string;
    totalApplications: number;
    inReview: number;
    interviewed: number;
    offered: number;
    status: 'active' | 'filled' | 'paused';
  }>;
}

const TeamAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<TeamAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchTeamAnalytics();
  }, [selectedPeriod]);

  const fetchTeamAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch data from multiple endpoints
      const [applicationsRes, jobsRes] = await Promise.all([
        api.get('/applications/'),
        api.get('/jobs/')
      ]);

      const applications = applicationsRes.data;
      const jobs = jobsRes.data;

      // Filter for manager's department (mock filtering)
      const managerDepartment = 'Engineering';
      const teamApplications = applications.filter((app: any) => 
        app.job?.department === managerDepartment
      );
      const teamJobs = jobs.filter((job: any) => 
        job.department === managerDepartment
      );

      // Calculate team analytics
      const teamMembers = 8; // Mock team size
      const activeRequisitions = teamJobs.filter((job: any) => job.status === 'Active').length;
      const totalApplications = teamApplications.length;
      const averageTimeToHire = 16; // Mock data
      
      const hiredApplications = teamApplications.filter((app: any) => app.status === 'Offer Extended').length;
      const teamHireRate = totalApplications > 0 ? (hiredApplications / totalApplications) * 100 : 0;
      
      // Mock monthly applications data
      const monthlyApplications = [25, 32, 28, 35, 41, 38, 45, 42, 48, 52, 49, 55];
      
      // Mock team performance data
      const teamPerformance = [
        {
          member: 'Sarah Johnson',
          role: 'Senior Engineer',
          applicationsReviewed: 45,
          interviewsConducted: 22,
          hiresCompleted: 8
        },
        {
          member: 'Mike Chen',
          role: 'Lead Engineer',
          applicationsReviewed: 38,
          interviewsConducted: 18,
          hiresCompleted: 6
        },
        {
          member: 'Emily Davis',
          role: 'Engineering Manager',
          applicationsReviewed: 52,
          interviewsConducted: 28,
          hiresCompleted: 12
        },
        {
          member: 'David Rodriguez',
          role: 'Senior Engineer',
          applicationsReviewed: 31,
          interviewsConducted: 15,
          hiresCompleted: 5
        }
      ];

      // Mock requisition progress
      const requisitionProgress = [
        {
          position: 'Senior Frontend Engineer',
          department: 'Engineering',
          totalApplications: 28,
          inReview: 8,
          interviewed: 5,
          offered: 2,
          status: 'active' as const
        },
        {
          position: 'Backend Engineer',
          department: 'Engineering',
          totalApplications: 35,
          inReview: 12,
          interviewed: 8,
          offered: 3,
          status: 'active' as const
        },
        {
          position: 'DevOps Engineer',
          department: 'Engineering',
          totalApplications: 22,
          inReview: 5,
          interviewed: 3,
          offered: 1,
          status: 'active' as const
        }
      ];

      setAnalyticsData({
        teamMembers,
        activeRequisitions,
        totalApplications,
        averageTimeToHire,
        teamHireRate,
        monthlyApplications,
        teamPerformance,
        requisitionProgress
      });
    } catch (error) {
      console.error('Error fetching team analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'filled': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Team Analytics</h1>
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
        <h1 className="text-3xl font-bold text-gray-900">Team Analytics</h1>
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load team analytics data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Analytics</h1>
          <p className="text-gray-600 mt-2">Track your team's recruitment performance and metrics</p>
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
          title="Team Members"
          value={analyticsData.teamMembers.toString()}
          icon={Users}
          color="blue"
          subtitle="Active recruiters"
        />
        
        <DashboardCard
          title="Active Positions"
          value={analyticsData.activeRequisitions.toString()}
          icon={Briefcase}
          color="green"
          subtitle="Open requisitions"
        />
        
        <DashboardCard
          title="Applications"
          value={analyticsData.totalApplications.toString()}
          icon={FileText}
          color="purple"
          change={{ type: 'increase', value: 18, period: 'last month' }}
        />
        
        <DashboardCard
          title="Avg. Time to Hire"
          value={`${analyticsData.averageTimeToHire} days`}
          icon={Clock}
          color="orange"
          change={{ type: 'decrease', value: 8, period: 'last month' }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Team Application Trends */}
        <div className="workday-card">
          <div className="workday-card-header">
            <h3 className="text-lg font-semibold text-gray-900">Application Trends</h3>
            <p className="text-sm text-gray-500">Monthly application volume for your team</p>
          </div>
          <ChartCard
            title="Applications"
            data={analyticsData.monthlyApplications.map((value, index) => ({
              day: index + 1,
              current: value,
              previous: Math.max(0, value - Math.floor(Math.random() * 8) + 4)
            }))}
          />
        </div>

        {/* Team Performance Summary */}
        <div className="workday-card">
          <div className="workday-card-header">
            <h3 className="text-lg font-semibold text-gray-900">Team Performance</h3>
            <p className="text-sm text-gray-500">Key metrics for the team</p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-lg mx-auto mb-2">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-blue-600">{analyticsData.totalApplications}</p>
                <p className="text-sm text-gray-600">Total Reviews</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-lg mx-auto mb-2">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-green-600">63</p>
                <p className="text-sm text-gray-600">Interviews</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-500 rounded-lg mx-auto mb-2">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-purple-600">31</p>
                <p className="text-sm text-gray-600">Hires</p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Team Hire Rate</span>
                <span className="text-sm font-bold text-gray-900">{analyticsData.teamHireRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${Math.min(100, analyticsData.teamHireRate)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Requisition Progress */}
      <div className="workday-card">
        <div className="workday-card-header">
          <h3 className="text-lg font-semibold text-gray-900">Requisition Progress</h3>
          <p className="text-sm text-gray-500">Current status of open positions</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Position</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Applications</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">In Review</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Interviewed</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Offers</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analyticsData.requisitionProgress.map((req, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{req.position}</p>
                      <p className="text-sm text-gray-500">{req.department}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{req.totalApplications}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{req.inReview}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{req.interviewed}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{req.offered}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Member Performance */}
      <div className="workday-card">
        <div className="workday-card-header">
          <h3 className="text-lg font-semibold text-gray-900">Team Member Performance</h3>
          <p className="text-sm text-gray-500">Individual contributions to recruitment efforts</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analyticsData.teamPerformance.map((member, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{member.member}</h4>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Applications Reviewed</span>
                  <span className="text-sm font-semibold text-gray-900">{member.applicationsReviewed}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Interviews Conducted</span>
                  <span className="text-sm font-semibold text-gray-900">{member.interviewsConducted}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Hires Completed</span>
                  <span className="text-sm font-semibold text-green-600">{member.hiresCompleted}</span>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Success Rate</span>
                    <span className="text-sm font-semibold text-blue-600">
                      {((member.hiresCompleted / member.applicationsReviewed) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="workday-card">
        <div className="workday-card-header">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <p className="text-sm text-gray-500">Common team management tasks</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200">
            <Calendar className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700">Schedule Team Meeting</p>
          </button>
          
          <button className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors duration-200">
            <Target className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700">Set Team Goals</p>
          </button>
          
          <button className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors duration-200">
            <Award className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700">Performance Review</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamAnalytics;