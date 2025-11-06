// Based on our Django models

export interface Job {
  id: number;
  title: string;
  description: string;
  positions: number;
  department: string;
}

export interface Candidate {
  id: number;
  fName: string;
  lName: string;
  email: string;
  phone: string;
}

// Based on our Django models

export interface Job {
  id: number;
  title: string;
  description: string;
  positions: number;
  department: string;
}

export interface Candidate {
  id: number;
  fName: string;
  lName: string;
  email: string;
  phone: string;
}

export interface Application {
  id: number;
  applicationDate: string;
  status: string;
  // Read-only fields from serializer
  candidate_name: string;
  job_title: string;
  job_department: string;
  // Write-only fields for creation
  candidate: number;
  job: number;
}
