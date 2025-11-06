import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import WelcomeCard from './WelcomeCard';
import NewApplicationsCard from './NewApplicationsCard';
import MetricCard from './MetricCard';
import SummaryCard from './SummaryCard';
import ChartCard from './ChartCard';
import { Application, Candidate } from '../types';
import api from '../api';

interface DashboardProps {
  onViewChange: (view: string, data?: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        <Loader2 size={32} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  // Calculate metrics
  const newApplications = applications.filter(
    app => new Date(app.applicationDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  const totalApplications = applications.length;
  const activeCandidates = candidates.length;
  const totalHired = applications.filter(app => app.status === 'Offer Extended').length;
  
  // Generate chart data (mock data for now, can be enhanced with real data)
  const chartData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    current: Math.floor(Math.random() * 200) + 100,
    previous: Math.floor(Math.random() * 150) + 80,
  }));

  // Filter to show only every 3rd day
  const filteredChartData = chartData.filter((_, i) => i % 3 === 0 || i === chartData.length - 1);

  return (
    <div className="space-y-6">
      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WelcomeCard
          userName="David Turner"
          newApplications={newApplications}
          notifications={25}
        />
        <NewApplicationsCard 
          applications={applications.slice().reverse()} 
          onViewAll={() => onViewChange('applications')}
        />
        <div className="flex flex-col gap-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

export default Dashboard;

