import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Briefcase, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Bell, 
  User, 
  Upload, 
  Users,
  Eye,
  Calendar
} from 'lucide-react';
import DashboardCard from '../ui/DashboardCard';
import { Application, Job } from '../../types';
import api from '../../api';
import Modal from '../ui/Modal';

interface Candidate {
  id: number;
  fName: string;
  lName: string;
  email: string;
  phone: string;
  bio: string;
  linkedin: string;
  portfolio: string;
  resume_url?: string;
}

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  job?: number;
  job_title?: string;
  is_read: boolean;
  created_at: string;
}

interface CandidateDashboardProps {
  onViewChange: (view: string, data?: any) => void;
}

const CandidateDashboard: React.FC<CandidateDashboardProps> = ({ onViewChange }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [profile, setProfile] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [coverLetter, setCoverLetter] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [appsRes, jobsRes, notifsRes, profileRes, unreadRes] = await Promise.all([
        api.get('/applications/'),
        api.get('/jobs/'),
        api.get('/notifications/'),
        api.get('/candidates/my_profile/').catch(() => null),
        api.get('/notifications/unread_count/').catch(() => ({ data: { count: 0 } })),
      ]);
      setApplications(appsRes.data);
      setJobs(jobsRes.data);
      setNotifications(notifsRes.data);
      setProfile(profileRes?.data || null);
      setUnreadCount(unreadRes.data.count || 0);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    setIsLoading(false);
  };

  const handleApply = async () => {
    if (!selectedJob) return;
    try {
      await api.post('/applications/', {
        job: Number(selectedJob),
        status: 'Received',
        coverLetter: coverLetter,
      });
      setIsApplyModalOpen(false);
      setSelectedJob('');
      setCoverLetter('');
      fetchData();
    } catch (error: any) {
      console.error('Error applying:', error);
      alert(error.response?.data?.error || 'Failed to submit application');
    }
  };

  const handleWithdraw = async (applicationId: number) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      await api.post(`/applications/${applicationId}/withdraw/`);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to withdraw application');
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('resume', file);
    
    try {
      await api.post('/candidates/upload_resume/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchData();
      alert('Resume uploaded successfully!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to upload resume');
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      fName: formData.get('fName'),
      lName: formData.get('lName'),
      phone: formData.get('phone'),
      bio: formData.get('bio'),
      linkedin: formData.get('linkedin'),
      portfolio: formData.get('portfolio'),
    };
    
    try {
      await api.patch('/candidates/update_profile/', data);
      setIsProfileModalOpen(false);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update profile');
    }
  };

  const markNotificationRead = async (id: number) => {
    try {
      await api.post(`/notifications/${id}/mark_read/`);
      fetchData();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await api.post('/notifications/mark_all_read/');
      fetchData();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const myApplications = applications;
  const appliedJobIds = new Set(myApplications.map(app => app.job));
  const newJobs = jobs.filter(job => !appliedJobIds.has(job.id));
  
  const statusCounts = {
    received: myApplications.filter(app => app.status === 'Received').length,
    review: myApplications.filter(app => app.status === 'Under Review').length,
    interview: myApplications.filter(app => app.status === 'Interview').length,
    offer: myApplications.filter(app => app.status === 'Offer Extended').length,
    rejected: myApplications.filter(app => app.status === 'Rejected').length,
    withdrawn: myApplications.filter(app => app.status === 'Withdrawn').length,
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Offer Extended': return <CheckCircle className="text-green-600" size={16} />;
      case 'Rejected': return <XCircle className="text-red-600" size={16} />;
      case 'Interview': return <Calendar className="text-purple-600" size={16} />;
      case 'Under Review': return <Eye className="text-yellow-600" size={16} />;
      default: return <Clock className="text-blue-600" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Received': return 'text-blue-600 bg-blue-50';
      case 'Under Review': return 'text-yellow-600 bg-yellow-50';
      case 'Interview': return 'text-purple-600 bg-purple-50';
      case 'Offer Extended': return 'text-green-600 bg-green-50';
      case 'Rejected': return 'text-red-600 bg-red-50';
      case 'Withdrawn': return 'text-gray-600 bg-gray-50';
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
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.fName || 'Candidate'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Track your applications and discover new opportunities
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-3 hover:bg-gray-100 rounded-lg transition-colors duration-150"
            >
              <Bell className="h-5 w-5 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="divide-y divide-gray-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-500">
                      <Bell className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${!notif.is_read ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                        onClick={() => markNotificationRead(notif.id)}
                      >
                        <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notif.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="workday-button-secondary flex items-center space-x-2"
          >
            <User className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="workday-button-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Apply to Job</span>
          </button>
        </div>
      </div>

      {/* Application Status Overview */}
      <div className="dashboard-grid">
        <DashboardCard
          title="Applications Submitted"
          value={myApplications.length}
          icon={FileText}
          color="blue"
          change={{
            value: 12.5,
            type: 'increase',
            period: 'last month'
          }}
        />
        
        <DashboardCard
          title="Under Review"
          value={statusCounts.review}
          icon={Eye}
          color="orange"
          subtitle="Pending response"
        />
        
        <DashboardCard
          title="Interviews"
          value={statusCounts.interview}
          icon={Calendar}
          color="purple"
          subtitle="Scheduled"
        />
        
        <DashboardCard
          title="Offers Received"
          value={statusCounts.offer}
          icon={CheckCircle}
          color="green"
          subtitle="Success rate"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Application Timeline */}
        <div className="xl:col-span-2 workday-card">
          <div className="workday-card-header">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab('applications')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  activeTab === 'applications'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                My Applications ({myApplications.length})
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  activeTab === 'jobs'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Available Jobs ({newJobs.length})
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {activeTab === 'applications' ? (
              <div className="space-y-4">
                {myApplications.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-medium">No applications yet</p>
                    <p className="text-sm">Apply to a job to get started on your career journey!</p>
                  </div>
                ) : (
                  myApplications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${getStatusColor(app.status)}`}>
                          {getStatusIcon(app.status)}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{app.job_title}</h3>
                          <p className="text-sm text-gray-600">{app.job_department}</p>
                          <p className="text-xs text-gray-400">
                            Applied: {new Date(app.applicationDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                        {app.status !== 'Withdrawn' && app.status !== 'Offer Extended' && app.status !== 'Rejected' && (
                          <button
                            onClick={() => handleWithdraw(app.id)}
                            className="block mt-2 px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded-md border border-red-200 transition-colors duration-150"
                          >
                            Withdraw
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {newJobs.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-medium">No new job postings</p>
                    <p className="text-sm">Check back later for new opportunities</p>
                  </div>
                ) : (
                  newJobs.map((job) => (
                    <div key={job.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                              <Briefcase className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900">{job.title}</h3>
                              <p className="text-sm text-gray-600">{job.department}</p>
                            </div>
                          </div>
                          {job.description && (
                            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{job.description}</p>
                          )}
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{job.positions} position{job.positions > 1 ? 's' : ''}</span>
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedJob(job.id.toString());
                            setIsApplyModalOpen(true);
                          }}
                          className="ml-4 workday-button-primary text-sm"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Profile & Resume Section */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="workday-card">
            <div className="workday-card-header">
              <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="workday-button-secondary"
              >
                <User className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              {profile ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {profile.fName} {profile.lName}
                      </h3>
                      <p className="text-sm text-gray-600">{profile.email}</p>
                    </div>
                  </div>
                  {profile.bio && (
                    <p className="text-sm text-gray-600">{profile.bio}</p>
                  )}
                </>
              ) : (
                <div className="text-center py-6">
                  <User className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">Profile not set up</p>
                </div>
              )}
            </div>
          </div>

          {/* Resume Card */}
          <div className="workday-card">
            <div className="workday-card-header">
              <h2 className="text-lg font-semibold text-gray-900">Resume</h2>
            </div>
            {profile?.resume_url ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-green-900">Resume uploaded</span>
                  </div>
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="workday-button-secondary text-sm"
                  >
                    View
                  </a>
                </div>
                <label className="workday-button-secondary w-full cursor-pointer flex items-center justify-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Replace Resume</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="text-center py-8">
                <Upload className="h-8 w-8 mx-auto text-gray-300 mb-4" />
                <p className="text-sm text-gray-500 mb-4">No resume uploaded</p>
                <label className="workday-button-primary cursor-pointer flex items-center justify-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload Resume</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal isOpen={isApplyModalOpen} onClose={() => {
        setIsApplyModalOpen(false);
        setSelectedJob('');
        setCoverLetter('');
      }} title="Apply to Job">
        <form onSubmit={(e) => { e.preventDefault(); handleApply(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Job</label>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="workday-input"
              required
            >
              <option value="">Choose a job...</option>
              {newJobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title} - {job.department}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter (Optional)</label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              className="workday-input"
              placeholder="Tell us why you're interested in this position..."
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsApplyModalOpen(false);
                setSelectedJob('');
                setCoverLetter('');
              }}
              className="workday-button-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedJob}
              className="workday-button-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Application
            </button>
          </div>
        </form>
      </Modal>

      {/* Profile Edit Modal */}
      <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="Edit Profile">
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="fName"
                defaultValue={profile?.fName || ''}
                className="workday-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lName"
                defaultValue={profile?.lName || ''}
                className="workday-input"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              defaultValue={profile?.phone || ''}
              className="workday-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              name="bio"
              defaultValue={profile?.bio || ''}
              rows={3}
              maxLength={500}
              className="workday-input"
              placeholder="Tell us about yourself..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
            <input
              type="url"
              name="linkedin"
              defaultValue={profile?.linkedin || ''}
              className="workday-input"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio URL</label>
            <input
              type="url"
              name="portfolio"
              defaultValue={profile?.portfolio || ''}
              className="workday-input"
              placeholder="https://yourportfolio.com"
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              className="workday-button-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="workday-button-primary flex-1"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CandidateDashboard;
