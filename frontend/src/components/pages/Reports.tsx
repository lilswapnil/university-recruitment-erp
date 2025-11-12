import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  Briefcase,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import ChartCard from '../ui/ChartCard';
import api from '../../api';

interface ReportData {
  totalCandidates: number;
  totalApplications: number;
  activeJobs: number;
  hireRate: number;
  monthlyHires: number[];
  departmentBreakdown: Array<{
    department: string;
    applications: number;
    hires: number;
    hireRate: number;
  }>;
  sourceBreakdown: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
  timeToHireData: Array<{
    position: string;
    averageDays: number;
  }>;
}

const Reports: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<string>('overview');
  const [dateRange, setDateRange] = useState<string>('30d');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  useEffect(() => {
    fetchReportData();
  }, [selectedReport, dateRange, departmentFilter]);

  const fetchReportData = async () => {
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

      // Calculate report metrics
      const totalCandidates = candidates.length;
      const totalApplications = applications.length;
      const activeJobs = jobs.filter((job: any) => job.status === 'Active').length;
      
      const hiredApplications = applications.filter((app: any) => app.status === 'Offer Extended').length;
      const hireRate = totalApplications > 0 ? (hiredApplications / totalApplications) * 100 : 0;
      
      // Monthly hires data for chart
      const monthlyHires = [12, 15, 18, 22, 19, 25, 28, 24, 31, 29, 33, 36];
      
      // Department breakdown
      const departmentCounts: { [key: string]: { applications: number; hires: number } } = {};
      applications.forEach((app: any) => {
        const dept = app.job?.department || 'Other';
        if (!departmentCounts[dept]) {
          departmentCounts[dept] = { applications: 0, hires: 0 };
        }
        departmentCounts[dept].applications++;
        if (app.status === 'Offer Extended') {
          departmentCounts[dept].hires++;
        }
      });

      const departmentBreakdown = Object.entries(departmentCounts).map(([dept, stats]) => ({
        department: dept,
        applications: stats.applications,
        hires: stats.hires,
        hireRate: stats.applications > 0 ? (stats.hires / stats.applications) * 100 : 0
      }));

      // Source breakdown (mock data)
      const sourceBreakdown = [
        { source: 'Company Website', count: 142, percentage: 35 },
        { source: 'LinkedIn', count: 121, percentage: 30 },
        { source: 'Job Boards', count: 81, percentage: 20 },
        { source: 'Referrals', count: 61, percentage: 15 }
      ];

      // Time to hire data (mock data)
      const timeToHireData = [
        { position: 'Software Engineer', averageDays: 18 },
        { position: 'Product Manager', averageDays: 25 },
        { position: 'UX Designer', averageDays: 22 },
        { position: 'Data Scientist', averageDays: 28 },
        { position: 'Sales Representative', averageDays: 15 }
      ];

      setReportData({
        totalCandidates,
        totalApplications,
        activeJobs,
        hireRate,
        monthlyHires,
        departmentBreakdown,
        sourceBreakdown,
        timeToHireData
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = (format: 'pdf' | 'excel') => {
    // Mock export functionality
    console.log(`Exporting report as ${format}`);
    alert(`Report export (${format.toUpperCase()}) functionality would be implemented here.`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load report data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Generate comprehensive recruitment reports</p>
        </div>
        
        {/* Export Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleExportReport('pdf')}
            className="workday-button-secondary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => handleExportReport('excel')}
            className="workday-button-primary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div>
          <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 mb-1">
            Report Type
          </label>
          <select
            id="report-type"
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="workday-input w-48"
          >
            <option value="overview">Overview</option>
            <option value="hiring-metrics">Hiring Metrics</option>
            <option value="department">Department Analysis</option>
            <option value="source">Source Analysis</option>
            <option value="time-to-hire">Time to Hire</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <select
            id="date-range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="workday-input w-40"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            id="department"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="workday-input w-40"
          >
            <option value="all">All Departments</option>
            <option value="engineering">Engineering</option>
            <option value="product">Product</option>
            <option value="design">Design</option>
            <option value="sales">Sales</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="workday-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900">{reportData.totalApplications}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12% from last period
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="workday-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Candidates</p>
              <p className="text-3xl font-bold text-gray-900">{reportData.totalCandidates}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +8% from last period
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="workday-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Positions</p>
              <p className="text-3xl font-bold text-gray-900">{reportData.activeJobs}</p>
              <p className="text-sm text-blue-600 flex items-center mt-1">
                <Briefcase className="h-4 w-4 mr-1" />
                Across {reportData.departmentBreakdown.length} departments
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="workday-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hire Rate</p>
              <p className="text-3xl font-bold text-gray-900">{reportData.hireRate.toFixed(1)}%</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +5% from last period
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {selectedReport === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Hiring Trend */}
          <div className="workday-card">
            <div className="workday-card-header">
              <div className="flex items-center space-x-2">
                <LineChart className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Monthly Hiring Trend</h3>
              </div>
              <p className="text-sm text-gray-500">Successful hires over time</p>
            </div>
            <ChartCard
              title="Hires"
              data={reportData.monthlyHires.map((value, index) => ({
                day: index + 1,
                current: value,
                previous: Math.max(0, value - Math.floor(Math.random() * 5) + 2)
              }))}
            />
          </div>
          
          {/* Department Performance */}
          <div className="workday-card">
            <div className="workday-card-header">
              <div className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Department Performance</h3>
              </div>
              <p className="text-sm text-gray-500">Applications vs. hires by department</p>
            </div>
            <div className="space-y-4">
              {reportData.departmentBreakdown.map((dept) => (
                <div key={dept.department} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{dept.department}</span>
                    <span className="text-sm text-gray-500">{dept.hireRate.toFixed(1)}% hire rate</span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (dept.applications / 50) * 100)}%` }}
                      />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (dept.hires / 15) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{dept.applications} applications</span>
                    <span>{dept.hires} hires</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedReport === 'source' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Source Breakdown */}
          <div className="workday-card">
            <div className="workday-card-header">
              <h3 className="text-lg font-semibold text-gray-900">Application Sources</h3>
              <p className="text-sm text-gray-500">Where candidates are coming from</p>
            </div>
            <div className="space-y-4">
              {reportData.sourceBreakdown.map((source) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">{source.source}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-12 text-right">{source.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Time to Hire by Position */}
          <div className="workday-card">
            <div className="workday-card-header">
              <h3 className="text-lg font-semibold text-gray-900">Time to Hire</h3>
              <p className="text-sm text-gray-500">Average days by position</p>
            </div>
            <div className="space-y-4">
              {reportData.timeToHireData.map((position) => (
                <div key={position.position} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{position.position}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (position.averageDays / 30) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-900 w-16 text-right">{position.averageDays} days</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Report Summary */}
      <div className="workday-card">
        <div className="workday-card-header">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Report Summary</h3>
          </div>
          <p className="text-sm text-gray-500">Key insights from the selected period</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Strong Growth</h4>
            <p className="text-sm text-gray-600">
              Application volume increased by 12% compared to the previous period, 
              indicating successful recruitment marketing efforts.
            </p>
          </div>
          
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="w-12 h-12 bg-green-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Quality Pipeline</h4>
            <p className="text-sm text-gray-600">
              Hire rate of {reportData.hireRate.toFixed(1)}% demonstrates effective screening 
              and a strong candidate pipeline across all departments.
            </p>
          </div>
          
          <div className="text-center p-6 bg-orange-50 rounded-lg">
            <div className="w-12 h-12 bg-orange-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Process Efficiency</h4>
            <p className="text-sm text-gray-600">
              Average time to hire remains competitive at 21 days, with room for 
              improvement in certain technical positions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;