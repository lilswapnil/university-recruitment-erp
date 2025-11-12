import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  UserCheck,
  MessageSquare,
  Star,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import Modal from '../ui/Modal';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  startDate: string;
  location: string;
  status: 'active' | 'on-leave' | 'remote';
  avatar?: string;
  performance: {
    applicationsReviewed: number;
    interviewsConducted: number;
    hiresCompleted: number;
    rating: number;
  };
  skills: string[];
  recentActivity: Array<{
    action: string;
    date: string;
    description: string;
  }>;
}

const MyTeam: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      
      // Mock team data since we don't have a team endpoint
      const mockTeamMembers: TeamMember[] = [
        {
          id: 1,
          name: 'Sarah Johnson',
          email: 'sarah.johnson@company.com',
          phone: '+1 (555) 123-4567',
          position: 'Senior Software Engineer',
          department: 'Engineering',
          startDate: '2023-03-15',
          location: 'New York, NY',
          status: 'active',
          performance: {
            applicationsReviewed: 45,
            interviewsConducted: 22,
            hiresCompleted: 8,
            rating: 4.8
          },
          skills: ['React', 'Node.js', 'Python', 'System Design', 'Mentoring'],
          recentActivity: [
            {
              action: 'Interview Conducted',
              date: '2025-11-12',
              description: 'Technical interview for Senior Frontend Engineer position'
            },
            {
              action: 'Application Reviewed',
              date: '2025-11-11',
              description: 'Reviewed 3 applications for Backend Engineer role'
            }
          ]
        },
        {
          id: 2,
          name: 'Mike Chen',
          email: 'mike.chen@company.com',
          phone: '+1 (555) 234-5678',
          position: 'Lead Software Engineer',
          department: 'Engineering',
          startDate: '2022-08-20',
          location: 'San Francisco, CA',
          status: 'active',
          performance: {
            applicationsReviewed: 38,
            interviewsConducted: 18,
            hiresCompleted: 6,
            rating: 4.6
          },
          skills: ['Java', 'Microservices', 'Docker', 'Kubernetes', 'Leadership'],
          recentActivity: [
            {
              action: 'Team Meeting',
              date: '2025-11-12',
              description: 'Led weekly engineering team standup meeting'
            },
            {
              action: 'Hire Completed',
              date: '2025-11-10',
              description: 'Successfully onboarded new junior developer'
            }
          ]
        },
        {
          id: 3,
          name: 'Emily Davis',
          email: 'emily.davis@company.com',
          phone: '+1 (555) 345-6789',
          position: 'Engineering Manager',
          department: 'Engineering',
          startDate: '2021-11-10',
          location: 'Austin, TX',
          status: 'active',
          performance: {
            applicationsReviewed: 52,
            interviewsConducted: 28,
            hiresCompleted: 12,
            rating: 4.9
          },
          skills: ['Team Management', 'Strategic Planning', 'Process Improvement', 'Agile'],
          recentActivity: [
            {
              action: 'Performance Review',
              date: '2025-11-11',
              description: 'Completed quarterly performance reviews for team'
            },
            {
              action: 'Interview Panel',
              date: '2025-11-09',
              description: 'Participated in final round for Senior Engineer position'
            }
          ]
        },
        {
          id: 4,
          name: 'David Rodriguez',
          email: 'david.rodriguez@company.com',
          phone: '+1 (555) 456-7890',
          position: 'Senior Software Engineer',
          department: 'Engineering',
          startDate: '2023-07-01',
          location: 'Remote',
          status: 'remote',
          performance: {
            applicationsReviewed: 31,
            interviewsConducted: 15,
            hiresCompleted: 5,
            rating: 4.5
          },
          skills: ['Python', 'Machine Learning', 'Data Analysis', 'APIs'],
          recentActivity: [
            {
              action: 'Code Review',
              date: '2025-11-12',
              description: 'Reviewed and approved 5 pull requests'
            },
            {
              action: 'Technical Interview',
              date: '2025-11-10',
              description: 'Conducted technical screening for ML Engineer role'
            }
          ]
        },
        {
          id: 5,
          name: 'Lisa Brown',
          email: 'lisa.brown@company.com',
          phone: '+1 (555) 567-8901',
          position: 'QA Engineer',
          department: 'Engineering',
          startDate: '2024-01-15',
          location: 'Chicago, IL',
          status: 'on-leave',
          performance: {
            applicationsReviewed: 28,
            interviewsConducted: 12,
            hiresCompleted: 4,
            rating: 4.7
          },
          skills: ['Test Automation', 'Selenium', 'Quality Assurance', 'Bug Tracking'],
          recentActivity: [
            {
              action: 'Leave Started',
              date: '2025-11-05',
              description: 'Started maternity leave - returning January 2026'
            }
          ]
        }
      ];
      
      setTeamMembers(mockTeamMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      case 'remote': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <UserCheck className="h-4 w-4" />;
      case 'on-leave': return <Clock className="h-4 w-4" />;
      case 'remote': return <MapPin className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewMember = (member: TeamMember) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Team</h1>
        </div>
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Team</h1>
          <p className="text-gray-600 mt-2">Manage and track your team members' performance</p>
        </div>
        
        <button className="workday-button-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Team Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="workday-card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="workday-card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {teamMembers.filter(m => m.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="workday-card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {(teamMembers.reduce((sum, m) => sum + m.performance.rating, 0) / teamMembers.length).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="workday-card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hires</p>
              <p className="text-2xl font-bold text-gray-900">
                {teamMembers.reduce((sum, m) => sum + m.performance.hiresCompleted, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="workday-input pl-10"
            />
          </div>
        </div>
        
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="workday-input w-40"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="remote">Remote</option>
            <option value="on-leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="workday-card hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.position}</p>
                </div>
              </div>
              
              <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                {getStatusIcon(member.status)}
                <span className="capitalize">{member.status.replace('-', ' ')}</span>
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{member.email}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{member.location}</span>
              </div>
              
              {/* Performance Metrics */}
              <div className="pt-3 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{member.performance.applicationsReviewed}</p>
                    <p className="text-xs text-gray-500">Reviews</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{member.performance.interviewsConducted}</p>
                    <p className="text-xs text-gray-500">Interviews</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-green-600">{member.performance.hiresCompleted}</p>
                    <p className="text-xs text-gray-500">Hires</p>
                  </div>
                </div>
              </div>
              
              {/* Rating */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(member.performance.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm font-medium text-gray-700 ml-1">
                    {member.performance.rating.toFixed(1)}
                  </span>
                </div>
                
                <button
                  onClick={() => handleViewMember(member)}
                  className="workday-button-secondary text-sm px-3 py-1"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No team members found matching your search criteria</p>
        </div>
      )}

      {/* Member Detail Modal */}
      {showModal && selectedMember && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={selectedMember.name}
        >
          <div className="space-y-6">
            {/* Member Info Header */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-xl">
                  {selectedMember.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedMember.name}</h3>
                <p className="text-gray-600">{selectedMember.position}</p>
                <p className="text-sm text-gray-500">{selectedMember.department}</p>
              </div>
            </div>
            
            {/* Contact Information */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{selectedMember.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{selectedMember.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{selectedMember.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Started: {new Date(selectedMember.startDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            {/* Performance Overview */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Performance Overview</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedMember.performance.applicationsReviewed}</p>
                  <p className="text-sm text-gray-600">Applications Reviewed</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedMember.performance.interviewsConducted}</p>
                  <p className="text-sm text-gray-600">Interviews Conducted</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-600">{selectedMember.performance.hiresCompleted}</p>
                  <p className="text-sm text-gray-600">Successful Hires</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <p className="text-2xl font-bold text-yellow-600">{selectedMember.performance.rating}</p>
                  </div>
                  <p className="text-sm text-gray-600">Performance Rating</p>
                </div>
              </div>
            </div>
            
            {/* Skills */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Skills & Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {selectedMember.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Recent Activity */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h4>
              <div className="space-y-3">
                {selectedMember.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyTeam;