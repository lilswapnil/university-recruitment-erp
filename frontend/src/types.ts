// Based on our Django models

export interface Job {
  id: number;
  title: string;
  description: string;
  positions: number;
  department: string;
  location?: string;
  status?: string;
  // Extended properties for enhanced job search
  company?: string;
  salaryRange?: string;
  jobType?: string;
  experienceLevel?: string;
  postedDate?: string;
  applicants?: number;
  benefits?: string[];
  skills?: string[];
}

export interface Candidate {
  id: number;
  fName: string;
  lName: string;
  email: string;
  phone: string;
  bio?: string;
  linkedin?: string;
  portfolio?: string;
  resume_url?: string;
}

export interface Application {
  id: number;
  applicationDate: string;
  status: string;
  coverLetter?: string;
  // Read-only fields from serializer
  candidate_name: string;
  job_title: string;
  job_department: string;
  // Write-only fields for creation
  candidate: number;
  job: number;
}
