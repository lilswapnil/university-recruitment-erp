import React, { useState, useEffect } from 'react';
import { Loader2, Search } from 'lucide-react';
import WelcomeCard from '../WelcomeCard';
import NewApplicationsCard from '../NewApplicationsCard';
import MetricCard from '../MetricCard';
import SummaryCard from '../SummaryCard';
import ChartCard from '../ChartCard';
import { Application, Candidate } from '../../types';
import api from '../../api';

interface HRDashboardProps {
  onViewChange: (view: string, data?: any) => void;
}

const HRDashboard: React.FC<HRDashboardProps> = ({ onViewChange }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, candidatesRes] = await Promise.all([
          api.get('/applications/'),
          api.get('/candidates/'),
        ]);
        setApplications(appsRes.data);
        setCandidates(candidatesRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 size={24} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchTerm === '' || 
      app.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate metrics
  const newApplications = applications.filter(
    app => new Date(app.applicationDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  const totalApplications = applications.length;
  const activeCandidates = candidates.length;
  const totalHired = applications.filter(app => app.status === 'Offer Extended').length;
  
  // Generate chart data based on real applications
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dayApplications = applications.filter(app => {
      const appDate = new Date(app.applicationDate);
      return appDate.toDateString() === date.toDateString();
    }).length;
    return {
      day: i + 1,
      current: dayApplications,
      previous: Math.floor(dayApplications * 0.7), // Mock previous month data
    };
  });
  
  const filteredChartData = chartData.filter((_, i) => i % 3 === 0 || i === chartData.length - 1);

  return (
    <div className="space-y-4">
      {/* Interactive Filters */}
      <div className="bg-white rounded-lg p-3 shadow-sm flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="Received">Received</option>
          <option value="Under Review">Under Review</option>
          <option value="Interview">Interview</option>
          <option value="Offer Extended">Offer Extended</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <WelcomeCard
          userName="HR Manager"
          newApplications={newApplications}
          notifications={25}
        />
        <NewApplicationsCard 
          applications={filteredApplications.slice().reverse()} 
          onViewAll={() => onViewChange('applications')}
        />
        <div className="flex flex-col gap-3">
          <MetricCard
            label="Total Applications"
            value={totalApplications >= 1000 ? `${(totalApplications / 1000).toFixed(1)}K` : `${totalApplications}`}
            change={12.57}
            color="green"
          />
          <MetricCard
            label="Active Candidates"
            value={activeCandidates >= 1000 ? `${(activeCandidates / 1000).toFixed(1)}K` : `${activeCandidates}`}
            change={-15.36}
            color="blue"
          />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SummaryCard
          totalDelivered={totalHired}
          growthPercent={25}
          target={6000}
        />
        <ChartCard data={filteredChartData} />
      </div>
    </div>
  );
};

export default HRDashboard;

