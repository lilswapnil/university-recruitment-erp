import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Video, 
  Phone, 
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Edit,
  Eye
} from 'lucide-react';
import Modal from '../ui/Modal';
import api from '../../api';

interface Interview {
  id: number;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  department: string;
  date: string;
  time: string;
  duration: number;
  type: 'video' | 'phone' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  interviewer: string;
  location?: string;
  meetingLink?: string;
  notes?: string;
}

const Interviews: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'create'>('view');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      
      // Mock interview data since we don't have an interviews endpoint
      const mockInterviews: Interview[] = [
        {
          id: 1,
          candidateName: 'Sarah Johnson',
          candidateEmail: 'sarah.johnson@email.com',
          jobTitle: 'Senior Software Engineer',
          department: 'Engineering',
          date: '2025-11-15',
          time: '10:00',
          duration: 60,
          type: 'video',
          status: 'scheduled',
          interviewer: 'John Smith',
          meetingLink: 'https://meet.google.com/abc-def-ghi',
          notes: 'Focus on React and system design'
        },
        {
          id: 2,
          candidateName: 'Michael Chen',
          candidateEmail: 'michael.chen@email.com',
          jobTitle: 'Product Manager',
          department: 'Product',
          date: '2025-11-15',
          time: '14:30',
          duration: 45,
          type: 'in-person',
          status: 'scheduled',
          interviewer: 'Lisa Brown',
          location: 'Conference Room A',
          notes: 'Portfolio review and strategy discussion'
        },
        {
          id: 3,
          candidateName: 'Emily Davis',
          candidateEmail: 'emily.davis@email.com',
          jobTitle: 'UX Designer',
          department: 'Design',
          date: '2025-11-14',
          time: '15:00',
          duration: 60,
          type: 'video',
          status: 'completed',
          interviewer: 'Alex Wilson',
          meetingLink: 'https://zoom.us/j/123456789',
          notes: 'Excellent portfolio presentation. Strong design thinking.'
        },
        {
          id: 4,
          candidateName: 'David Rodriguez',
          candidateEmail: 'david.rodriguez@email.com',
          jobTitle: 'Data Scientist',
          department: 'Analytics',
          date: '2025-11-13',
          time: '11:00',
          duration: 90,
          type: 'phone',
          status: 'no-show',
          interviewer: 'Maria Garcia',
          notes: 'Candidate did not attend scheduled interview'
        }
      ];
      
      setInterviews(mockInterviews);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'no-show': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'in-person': return <Users className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const filteredInterviews = interviews.filter(interview => {
    const statusMatch = filterStatus === 'all' || interview.status === filterStatus;
    const typeMatch = filterType === 'all' || interview.type === filterType;
    return statusMatch && typeMatch;
  });

  const handleViewInterview = (interview: Interview) => {
    setSelectedInterview(interview);
    setModalType('view');
    setShowModal(true);
  };

  const handleScheduleInterview = () => {
    setSelectedInterview(null);
    setModalType('create');
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Interviews</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Interview Management</h1>
          <p className="text-gray-600 mt-2">Schedule and manage candidate interviews</p>
        </div>
        
        <button
          onClick={handleScheduleInterview}
          className="workday-button-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule Interview</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="workday-input w-40"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No Show</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            id="type-filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="workday-input w-40"
          >
            <option value="all">All Types</option>
            <option value="video">Video</option>
            <option value="phone">Phone</option>
            <option value="in-person">In-Person</option>
          </select>
        </div>
      </div>

      {/* Interview List */}
      <div className="space-y-4">
        {filteredInterviews.map((interview) => (
          <div key={interview.id} className="workday-card hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Date & Time */}
                <div className="text-center min-w-16">
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(interview.date).getDate()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(interview.date).toLocaleDateString('en-US', { month: 'short' })}
                  </p>
                  <p className="text-xs text-gray-400">{interview.time}</p>
                </div>
                
                {/* Interview Details */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{interview.candidateName}</h3>
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                      {getStatusIcon(interview.status)}
                      <span className="capitalize">{interview.status.replace('-', ' ')}</span>
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-1">
                    {interview.jobTitle} • {interview.department}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      {getTypeIcon(interview.type)}
                      <span className="capitalize">{interview.type.replace('-', ' ')}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{interview.duration} min</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{interview.interviewer}</span>
                    </div>
                    
                    {interview.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{interview.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleViewInterview(interview)}
                  className="workday-button-secondary p-2"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
                
                {interview.status === 'scheduled' && (
                  <button
                    className="workday-button-secondary p-2"
                    title="Edit Interview"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {filteredInterviews.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No interviews found matching your filters</p>
          </div>
        )}
      </div>

      {/* Interview Detail Modal */}
      {showModal && selectedInterview && modalType === 'view' && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Interview Details"
        >
          <div className="space-y-6">
            {/* Candidate Info */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Candidate</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900">{selectedInterview.candidateName}</p>
                <p className="text-sm text-gray-600">{selectedInterview.candidateEmail}</p>
              </div>
            </div>
            
            {/* Position Info */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Position</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900">{selectedInterview.jobTitle}</p>
                <p className="text-sm text-gray-600">{selectedInterview.department}</p>
              </div>
            </div>
            
            {/* Interview Details */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Interview Details</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Date & Time:</span>
                  <span className="text-sm font-medium">{selectedInterview.date} at {selectedInterview.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="text-sm font-medium">{selectedInterview.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Type:</span>
                  <span className="text-sm font-medium capitalize">{selectedInterview.type.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Interviewer:</span>
                  <span className="text-sm font-medium">{selectedInterview.interviewer}</span>
                </div>
                {selectedInterview.location && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Location:</span>
                    <span className="text-sm font-medium">{selectedInterview.location}</span>
                  </div>
                )}
                {selectedInterview.meetingLink && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Meeting Link:</span>
                    <a href={selectedInterview.meetingLink} target="_blank" rel="noopener noreferrer" 
                       className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      Join Meeting
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            {/* Notes */}
            {selectedInterview.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{selectedInterview.notes}</p>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Schedule Interview Modal */}
      {showModal && modalType === 'create' && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Schedule New Interview"
        >
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Candidate
                </label>
                <select className="workday-input">
                  <option>Select candidate...</option>
                  <option>John Doe</option>
                  <option>Jane Smith</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <select className="workday-input">
                  <option>Select position...</option>
                  <option>Software Engineer</option>
                  <option>Product Manager</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input type="date" className="workday-input" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input type="time" className="workday-input" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select className="workday-input">
                  <option value="video">Video Call</option>
                  <option value="phone">Phone Call</option>
                  <option value="in-person">In-Person</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <select className="workday-input">
                  <option value="30">30</option>
                  <option value="45">45</option>
                  <option value="60">60</option>
                  <option value="90">90</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interviewer
              </label>
              <select className="workday-input">
                <option>Select interviewer...</option>
                <option>John Smith</option>
                <option>Lisa Brown</option>
                <option>Alex Wilson</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                className="workday-input"
                rows={3}
                placeholder="Interview focus areas, preparation notes..."
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="workday-button-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="workday-button-primary"
              >
                Schedule Interview
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Interviews;