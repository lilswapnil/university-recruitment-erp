import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase,
  DollarSign,
  Calendar,
  Clock,
  BookmarkPlus,
  Eye,
  Building,
  Users,
  Star,
  ChevronDown,
  TrendingUp
} from 'lucide-react';
import { Job } from '../../types';
import api from '../../api';

interface JobFilters {
  department: string;
  location: string;
  jobType: string;
  salaryRange: string;
  experienceLevel: string;
}

const JobSearch: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filters, setFilters] = useState<JobFilters>({
    department: '',
    location: '',
    jobType: '',
    salaryRange: '',
    experienceLevel: ''
  });

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, searchTerm, filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/jobs/');
      
      // Enhance jobs with additional mock data
      const enhancedJobs = response.data.map((job: Job) => ({
        ...job,
        company: 'University Tech Corp',
        salaryRange: generateSalaryRange(job.title),
        jobType: Math.random() > 0.7 ? 'Remote' : Math.random() > 0.5 ? 'Hybrid' : 'On-site',
        experienceLevel: generateExperienceLevel(job.title),
        postedDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        applicants: Math.floor(Math.random() * 150) + 10,
        benefits: ['Health Insurance', 'Dental Insurance', '401(k)', 'Flexible PTO', 'Remote Work Options'],
        skills: generateSkills(job.title)
      }));
      
      setJobs(enhancedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    // Mock saved jobs from localStorage
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSavedJobs(saved);
  };

  const generateSalaryRange = (title: string): string => {
    const baseSalaries: { [key: string]: [number, number] } = {
      'Software Engineer': [80000, 120000],
      'Senior Software Engineer': [120000, 160000],
      'Product Manager': [100000, 140000],
      'UX Designer': [70000, 110000],
      'Data Scientist': [90000, 130000],
      'DevOps Engineer': [85000, 125000],
      'Marketing Manager': [75000, 115000]
    };
    
    for (const [role, range] of Object.entries(baseSalaries)) {
      if (title.toLowerCase().includes(role.toLowerCase())) {
        return `$${range[0].toLocaleString()} - $${range[1].toLocaleString()}`;
      }
    }
    
    return '$70,000 - $110,000';
  };

  const generateExperienceLevel = (title: string): string => {
    if (title.toLowerCase().includes('senior') || title.toLowerCase().includes('lead')) {
      return 'Senior (5+ years)';
    } else if (title.toLowerCase().includes('junior') || title.toLowerCase().includes('associate')) {
      return 'Entry Level (0-2 years)';
    }
    return 'Mid Level (2-5 years)';
  };

  const generateSkills = (title: string): string[] => {
    const skillSets: { [key: string]: string[] } = {
      'Software Engineer': ['JavaScript', 'React', 'Node.js', 'Python', 'Git'],
      'Product Manager': ['Product Strategy', 'Analytics', 'Agile', 'Roadmapping', 'Stakeholder Management'],
      'UX Designer': ['Figma', 'Sketch', 'User Research', 'Prototyping', 'Design Systems'],
      'Data Scientist': ['Python', 'R', 'Machine Learning', 'SQL', 'Statistics'],
      'DevOps Engineer': ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
      'Marketing Manager': ['Digital Marketing', 'Content Strategy', 'Analytics', 'Campaign Management', 'SEO']
    };
    
    for (const [role, skills] of Object.entries(skillSets)) {
      if (title.toLowerCase().includes(role.toLowerCase())) {
        return skills;
      }
    }
    
    return ['Communication', 'Problem Solving', 'Team Work', 'Critical Thinking'];
  };

  const applyFilters = () => {
    let filtered = jobs.filter(job => {
      const matchesSearch = !searchTerm || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = !filters.department || job.department === filters.department;
      const matchesLocation = !filters.location || job.location?.includes(filters.location);
      const matchesJobType = !filters.jobType || job.jobType === filters.jobType;
      const matchesExperienceLevel = !filters.experienceLevel || job.experienceLevel === filters.experienceLevel;
      
      return matchesSearch && matchesDepartment && matchesLocation && matchesJobType && matchesExperienceLevel;
    });

    setFilteredJobs(filtered);
  };

  const handleSaveJob = (jobId: number) => {
    const newSavedJobs = savedJobs.includes(jobId)
      ? savedJobs.filter(id => id !== jobId)
      : [...savedJobs, jobId];
    
    setSavedJobs(newSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
  };

  const handleApply = (job: Job) => {
    // In a real app, this would navigate to application form or handle the application process
    alert(`Application for ${job.title} would be submitted here. This would typically open an application form or redirect to the application process.`);
  };

  const getDaysAgo = (dateString: string): string => {
    const days = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 3600 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  const uniqueDepartments = Array.from(new Set(jobs.map(job => job.department)));
  const uniqueLocations = Array.from(new Set(jobs.map(job => job.location).filter(Boolean)));
  const uniqueJobTypes = Array.from(new Set(jobs.map(job => job.jobType).filter(Boolean)));
  const uniqueExperienceLevels = Array.from(new Set(jobs.map(job => job.experienceLevel).filter(Boolean)));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Job Search</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Job Search</h1>
          <p className="text-gray-600 mt-2">
            Discover exciting opportunities and find your next career move
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search jobs by title, skills, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="workday-input pl-10 w-full"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="workday-button-secondary flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          <div className="text-sm text-gray-600">
            {filteredJobs.length} of {jobs.length} jobs
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="workday-card">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                  className="workday-input"
                >
                  <option value="">All Departments</option>
                  {uniqueDepartments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="workday-input"
                >
                  <option value="">All Locations</option>
                  {uniqueLocations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type
                </label>
                <select
                  value={filters.jobType}
                  onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                  className="workday-input"
                >
                  <option value="">All Types</option>
                  {uniqueJobTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level
                </label>
                <select
                  value={filters.experienceLevel}
                  onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
                  className="workday-input"
                >
                  <option value="">All Levels</option>
                  {uniqueExperienceLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({
                    department: '',
                    location: '',
                    jobType: '',
                    salaryRange: '',
                    experienceLevel: ''
                  })}
                  className="workday-button-secondary w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div key={job.id} className="workday-card hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                        {job.title}
                      </h3>
                      <p className="text-gray-600">{job.company}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleSaveJob(job.id)}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      savedJobs.includes(job.id)
                        ? 'text-blue-600 bg-blue-100'
                        : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <BookmarkPlus className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location || 'Remote'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Briefcase className="h-4 w-4" />
                    <span>{job.department}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salaryRange}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{job.postedDate ? getDaysAgo(job.postedDate) : 'Recently'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{job.applicants} applicants</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">
                  {job.description}
                </p>

                {/* Job Type and Experience Level Tags */}
                <div className="flex items-center space-x-2 mb-4">
                  {job.jobType && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {job.jobType}
                    </span>
                  )}
                  
                  {job.experienceLevel && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {job.experienceLevel}
                    </span>
                  )}
                  
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {job.status}
                  </span>
                </div>

                {/* Skills */}
                {job.skills && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {job.skills.slice(0, 5).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 5 && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                        +{job.skills.length - 5} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedJob(job)}
                  className="workday-button-secondary flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Details</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <TrendingUp className="h-4 w-4" />
                  <span>High demand</span>
                </div>
                
                <button
                  onClick={() => handleApply(job)}
                  className="workday-button-primary"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No jobs found</p>
            <p className="text-gray-400">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Building className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                    <p className="text-gray-600">{selectedJob.company}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Job Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{selectedJob.location || 'Remote'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <span>{selectedJob.department}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span>{selectedJob.salaryRange}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>Posted {selectedJob.postedDate ? getDaysAgo(selectedJob.postedDate) : 'Recently'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  {selectedJob.benefits && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Benefits</h4>
                      <ul className="space-y-1">
                        {selectedJob.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <Star className="h-3 w-3 text-green-500 mr-2" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
                  
                  <h4 className="text-md font-medium text-gray-900 mt-4 mb-2">Responsibilities:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Design and develop high-quality software solutions</li>
                    <li>Collaborate with cross-functional teams to deliver projects</li>
                    <li>Participate in code reviews and maintain coding standards</li>
                    <li>Contribute to architectural decisions and technical documentation</li>
                    <li>Mentor junior team members and share knowledge</li>
                  </ul>

                  <h4 className="text-md font-medium text-gray-900 mt-4 mb-2">Requirements:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Bachelor's degree in Computer Science or related field</li>
                    <li>3+ years of experience in software development</li>
                    <li>Strong proficiency in relevant programming languages</li>
                    <li>Experience with modern development frameworks and tools</li>
                    <li>Excellent problem-solving and communication skills</li>
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleSaveJob(selectedJob.id)}
                    className={`workday-button-secondary flex items-center space-x-2 ${
                      savedJobs.includes(selectedJob.id) ? 'bg-blue-100 text-blue-700' : ''
                    }`}
                  >
                    <BookmarkPlus className="h-4 w-4" />
                    <span>{savedJobs.includes(selectedJob.id) ? 'Saved' : 'Save Job'}</span>
                  </button>
                </div>
                
                <button
                  onClick={() => handleApply(selectedJob)}
                  className="workday-button-primary px-8"
                >
                  Apply for this Position
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSearch;