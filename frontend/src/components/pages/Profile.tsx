import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Edit,
  Save,
  Upload,
  Download,
  Eye,
  FileText,
  Plus,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface CandidateProfile {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    linkedinUrl: string;
    portfolioUrl: string;
    bio: string;
  };
  experience: Array<{
    id: number;
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
    technologies: string[];
  }>;
  education: Array<{
    id: number;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    gpa?: string;
  }>;
  skills: string[];
  certifications: Array<{
    id: number;
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialUrl?: string;
  }>;
  resume?: {
    filename: string;
    uploadDate: string;
    url: string;
  };
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills'>('personal');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // Mock profile data - in a real app this would come from the API
      const mockProfile: CandidateProfile = {
        personalInfo: {
          firstName: user?.username || 'John',
          lastName: 'Doe',
          email: user?.email || 'john.doe@email.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          linkedinUrl: 'https://linkedin.com/in/johndoe',
          portfolioUrl: 'https://johndoe.dev',
          bio: 'Passionate software engineer with 5+ years of experience in full-stack development. Skilled in React, Node.js, and cloud technologies. Looking for challenging opportunities to grow and contribute to innovative projects.'
        },
        experience: [
          {
            id: 1,
            company: 'Tech Innovations Inc.',
            position: 'Senior Software Engineer',
            startDate: '2022-03-01',
            current: true,
            description: 'Led development of microservices architecture, improving system performance by 40%. Mentored junior developers and collaborated with cross-functional teams.',
            technologies: ['React', 'Node.js', 'AWS', 'Docker', 'PostgreSQL']
          },
          {
            id: 2,
            company: 'StartupXYZ',
            position: 'Full Stack Developer',
            startDate: '2020-06-01',
            endDate: '2022-02-28',
            current: false,
            description: 'Developed and maintained web applications using modern JavaScript frameworks. Implemented CI/CD pipelines and automated testing.',
            technologies: ['Vue.js', 'Python', 'MongoDB', 'Jenkins', 'Kubernetes']
          }
        ],
        education: [
          {
            id: 1,
            institution: 'University of California, Berkeley',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            startDate: '2016-09-01',
            endDate: '2020-05-01',
            current: false,
            gpa: '3.8'
          }
        ],
        skills: [
          'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 
          'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'Redis',
          'Git', 'Agile/Scrum', 'System Design', 'RESTful APIs'
        ],
        certifications: [
          {
            id: 1,
            name: 'AWS Certified Solutions Architect',
            issuer: 'Amazon Web Services',
            issueDate: '2023-01-15',
            expiryDate: '2026-01-15',
            credentialUrl: 'https://aws.amazon.com/verification'
          },
          {
            id: 2,
            name: 'Certified Kubernetes Administrator',
            issuer: 'Cloud Native Computing Foundation',
            issueDate: '2022-08-20',
            expiryDate: '2025-08-20'
          }
        ],
        resume: {
          filename: 'John_Doe_Resume.pdf',
          uploadDate: '2025-11-01',
          url: '/uploads/resumes/john_doe_resume.pdf'
        }
      };
      
      setProfile(mockProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      // In a real app, this would save to the API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddExperience = () => {
    if (!profile) return;
    
    const newExperience = {
      id: Date.now(),
      company: '',
      position: '',
      startDate: '',
      current: true,
      description: '',
      technologies: []
    };
    
    setProfile({
      ...profile,
      experience: [...profile.experience, newExperience]
    });
  };

  const handleAddEducation = () => {
    if (!profile) return;
    
    const newEducation = {
      id: Date.now(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      current: false
    };
    
    setProfile({
      ...profile,
      education: [...profile.education, newEducation]
    });
  };

  const handleAddSkill = (skill: string) => {
    if (!profile || !skill.trim() || profile.skills.includes(skill)) return;
    
    setProfile({
      ...profile,
      skills: [...profile.skills, skill.trim()]
    });
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!profile) return;
    
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load profile data</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills & Certifications', icon: Award }
  ] as const;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your professional profile and resume</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="workday-button-secondary"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="workday-button-primary flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="workday-button-primary flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1">
          <div className="workday-card sticky top-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {profile.personalInfo.firstName[0]}{profile.personalInfo.lastName[0]}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {profile.personalInfo.firstName} {profile.personalInfo.lastName}
              </h3>
              
              {profile.experience.length > 0 && (
                <p className="text-gray-600 mb-4">
                  {profile.experience[0].position}
                </p>
              )}
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{profile.personalInfo.email}</span>
                </div>
                
                {profile.personalInfo.location && (
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.personalInfo.location}</span>
                  </div>
                )}
              </div>
              
              {/* Resume Section */}
              {profile.resume && (
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-3">
                    <FileText className="h-4 w-4" />
                    <span>Resume</span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">{profile.resume.filename}</p>
                    <div className="flex space-x-2">
                      <button className="flex-1 workday-button-secondary text-xs py-2 flex items-center justify-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>View</span>
                      </button>
                      <button className="flex-1 workday-button-secondary text-xs py-2 flex items-center justify-center space-x-1">
                        <Download className="h-3 w-3" />
                        <span>Download</span>
                      </button>
                    </div>
                    <button className="w-full workday-button-primary text-xs py-2 flex items-center justify-center space-x-1">
                      <Upload className="h-3 w-3" />
                      <span>Update Resume</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="workday-card">
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className="workday-card-header">
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                  <p className="text-sm text-gray-500">Update your basic information and contact details</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profile.personalInfo.firstName}
                      onChange={(e) => setProfile({
                        ...profile,
                        personalInfo: { ...profile.personalInfo, firstName: e.target.value }
                      })}
                      disabled={!editing}
                      className="workday-input"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profile.personalInfo.lastName}
                      onChange={(e) => setProfile({
                        ...profile,
                        personalInfo: { ...profile.personalInfo, lastName: e.target.value }
                      })}
                      disabled={!editing}
                      className="workday-input"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.personalInfo.email}
                      onChange={(e) => setProfile({
                        ...profile,
                        personalInfo: { ...profile.personalInfo, email: e.target.value }
                      })}
                      disabled={!editing}
                      className="workday-input"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profile.personalInfo.phone}
                      onChange={(e) => setProfile({
                        ...profile,
                        personalInfo: { ...profile.personalInfo, phone: e.target.value }
                      })}
                      disabled={!editing}
                      className="workday-input"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profile.personalInfo.location}
                      onChange={(e) => setProfile({
                        ...profile,
                        personalInfo: { ...profile.personalInfo, location: e.target.value }
                      })}
                      disabled={!editing}
                      className="workday-input"
                      placeholder="City, State"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={profile.personalInfo.linkedinUrl}
                      onChange={(e) => setProfile({
                        ...profile,
                        personalInfo: { ...profile.personalInfo, linkedinUrl: e.target.value }
                      })}
                      disabled={!editing}
                      className="workday-input"
                      placeholder="https://linkedin.com/in/yourname"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    value={profile.personalInfo.portfolioUrl}
                    onChange={(e) => setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, portfolioUrl: e.target.value }
                    })}
                    disabled={!editing}
                    className="workday-input"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Summary
                  </label>
                  <textarea
                    value={profile.personalInfo.bio}
                    onChange={(e) => setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, bio: e.target.value }
                    })}
                    disabled={!editing}
                    rows={4}
                    className="workday-input"
                    placeholder="Write a brief summary of your professional background and goals..."
                  />
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="workday-card-header">
                    <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
                    <p className="text-sm text-gray-500">Add your professional experience and achievements</p>
                  </div>
                  
                  {editing && (
                    <button
                      onClick={handleAddExperience}
                      className="workday-button-secondary flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Experience</span>
                    </button>
                  )}
                </div>
                
                <div className="space-y-6">
                  {profile.experience.map((exp, index) => (
                    <div key={exp.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company
                          </label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const newExperience = [...profile.experience];
                              newExperience[index] = { ...exp, company: e.target.value };
                              setProfile({ ...profile, experience: newExperience });
                            }}
                            disabled={!editing}
                            className="workday-input"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Position
                          </label>
                          <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => {
                              const newExperience = [...profile.experience];
                              newExperience[index] = { ...exp, position: e.target.value };
                              setProfile({ ...profile, experience: newExperience });
                            }}
                            disabled={!editing}
                            className="workday-input"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={exp.startDate}
                            onChange={(e) => {
                              const newExperience = [...profile.experience];
                              newExperience[index] = { ...exp, startDate: e.target.value };
                              setProfile({ ...profile, experience: newExperience });
                            }}
                            disabled={!editing}
                            className="workday-input"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={exp.endDate || ''}
                            onChange={(e) => {
                              const newExperience = [...profile.experience];
                              newExperience[index] = { ...exp, endDate: e.target.value };
                              setProfile({ ...profile, experience: newExperience });
                            }}
                            disabled={!editing || exp.current}
                            className="workday-input"
                          />
                        </div>
                      </div>
                      
                      {editing && (
                        <div className="mb-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={exp.current}
                              onChange={(e) => {
                                const newExperience = [...profile.experience];
                                newExperience[index] = { ...exp, current: e.target.checked };
                                if (e.target.checked) {
                                  newExperience[index].endDate = undefined;
                                }
                                setProfile({ ...profile, experience: newExperience });
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Current position</span>
                          </label>
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => {
                            const newExperience = [...profile.experience];
                            newExperience[index] = { ...exp, description: e.target.value };
                            setProfile({ ...profile, experience: newExperience });
                          }}
                          disabled={!editing}
                          rows={3}
                          className="workday-input"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Technologies Used
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                            >
                              {tech}
                              {editing && (
                                <button
                                  onClick={() => {
                                    const newExperience = [...profile.experience];
                                    newExperience[index] = {
                                      ...exp,
                                      technologies: exp.technologies.filter((_, i) => i !== techIndex)
                                    };
                                    setProfile({ ...profile, experience: newExperience });
                                  }}
                                  className="ml-1 text-blue-600 hover:text-blue-800"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="workday-card-header">
                    <h2 className="text-xl font-semibold text-gray-900">Education</h2>
                    <p className="text-sm text-gray-500">Add your educational background</p>
                  </div>
                  
                  {editing && (
                    <button
                      onClick={handleAddEducation}
                      className="workday-button-secondary flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Education</span>
                    </button>
                  )}
                </div>
                
                <div className="space-y-6">
                  {profile.education.map((edu, index) => (
                    <div key={edu.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Institution
                          </label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => {
                              const newEducation = [...profile.education];
                              newEducation[index] = { ...edu, institution: e.target.value };
                              setProfile({ ...profile, education: newEducation });
                            }}
                            disabled={!editing}
                            className="workday-input"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Degree
                          </label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const newEducation = [...profile.education];
                              newEducation[index] = { ...edu, degree: e.target.value };
                              setProfile({ ...profile, education: newEducation });
                            }}
                            disabled={!editing}
                            className="workday-input"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Field of Study
                          </label>
                          <input
                            type="text"
                            value={edu.field}
                            onChange={(e) => {
                              const newEducation = [...profile.education];
                              newEducation[index] = { ...edu, field: e.target.value };
                              setProfile({ ...profile, education: newEducation });
                            }}
                            disabled={!editing}
                            className="workday-input"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            GPA (Optional)
                          </label>
                          <input
                            type="text"
                            value={edu.gpa || ''}
                            onChange={(e) => {
                              const newEducation = [...profile.education];
                              newEducation[index] = { ...edu, gpa: e.target.value };
                              setProfile({ ...profile, education: newEducation });
                            }}
                            disabled={!editing}
                            className="workday-input"
                            placeholder="3.8"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={edu.startDate}
                            onChange={(e) => {
                              const newEducation = [...profile.education];
                              newEducation[index] = { ...edu, startDate: e.target.value };
                              setProfile({ ...profile, education: newEducation });
                            }}
                            disabled={!editing}
                            className="workday-input"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={edu.endDate || ''}
                            onChange={(e) => {
                              const newEducation = [...profile.education];
                              newEducation[index] = { ...edu, endDate: e.target.value };
                              setProfile({ ...profile, education: newEducation });
                            }}
                            disabled={!editing || edu.current}
                            className="workday-input"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-8">
                {/* Skills Section */}
                <div>
                  <div className="workday-card-header mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Technical Skills</h3>
                    <p className="text-sm text-gray-500">Add your technical skills and expertise</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {skill}
                        {editing && (
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  
                  {editing && (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add a skill"
                        className="workday-input flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddSkill((e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="Add a skill"]') as HTMLInputElement;
                          if (input) {
                            handleAddSkill(input.value);
                            input.value = '';
                          }
                        }}
                        className="workday-button-secondary"
                      >
                        Add Skill
                      </button>
                    </div>
                  )}
                </div>

                {/* Certifications Section */}
                <div className="border-t pt-8">
                  <div className="workday-card-header mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
                    <p className="text-sm text-gray-500">Professional certifications and achievements</p>
                  </div>
                  
                  <div className="space-y-4">
                    {profile.certifications.map((cert) => (
                      <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900">{cert.name}</h4>
                            <p className="text-gray-600 mb-2">{cert.issuer}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                              {cert.expiryDate && (
                                <span>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</span>
                              )}
                            </div>
                            {cert.credentialUrl && (
                              <a
                                href={cert.credentialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                              >
                                View Credential →
                              </a>
                            )}
                          </div>
                          
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Award className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;