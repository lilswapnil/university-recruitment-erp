import json
import os
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime
from api.models import Candidate, JobOpening, Application

class Command(BaseCommand):
    help = 'Populates the database with sample data from JSON files'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before populating',
        )

    def handle(self, *args, **options):
        # Get the base directory (project root)
        # From backend/api/management/commands/populatedb.py
        # Go up to project root: backend/api/management/commands -> backend/api/management -> backend/api -> backend -> project root
        backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
        project_root = os.path.dirname(backend_dir)
        data_dir = os.path.join(project_root, 'data')
        
        # Try alternative paths
        alternative_paths = [
            data_dir,  # Project root/data
            os.path.join(backend_dir, '..', 'data'),  # Relative to backend
            '/data',  # Mounted volume in Docker
            os.path.join(os.getcwd(), 'data'),  # Current working directory
        ]
        
        data_dir = None
        for path in alternative_paths:
            if os.path.exists(path):
                data_dir = path
                break
        
        if not data_dir or not os.path.exists(data_dir):
            self.stdout.write(self.style.ERROR(f'Data directory not found. Tried paths:'))
            for path in alternative_paths:
                self.stdout.write(self.style.ERROR(f'  - {path}'))
            self.stdout.write(self.style.ERROR(f'Current working directory: {os.getcwd()}'))
            return
        
        self.stdout.write(self.style.SUCCESS(f'Using data directory: {data_dir}'))

        if options['clear']:
            self.stdout.write(self.style.WARNING('Clearing existing data...'))
            Application.objects.all().delete()
            Candidate.objects.all().delete()
            JobOpening.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Existing data cleared.'))

        # Load candidates
        candidates_file = os.path.join(data_dir, 'candidates.json')
        if not os.path.exists(candidates_file):
            self.stdout.write(self.style.ERROR(f'Candidates file not found at {candidates_file}'))
            return

        self.stdout.write('Loading candidates...')
        with open(candidates_file, 'r') as f:
            candidates_data = json.load(f)
        
        candidates_created = 0
        candidates_skipped = 0
        candidate_objects = {}
        
        for idx, candidate_data in enumerate(candidates_data):
            try:
                candidate, created = Candidate.objects.get_or_create(
                    email=candidate_data['email'],
                    defaults={
                        'fName': candidate_data['fName'],
                        'lName': candidate_data['lName'],
                        'phone': candidate_data.get('phone', ''),
                    }
                )
                if created:
                    candidates_created += 1
                else:
                    candidates_skipped += 1
                candidate_objects[idx] = candidate
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error creating candidate {idx}: {e}'))
        
        self.stdout.write(self.style.SUCCESS(f'Created {candidates_created} candidates, skipped {candidates_skipped} existing.'))

        # Load jobs
        jobs_file = os.path.join(data_dir, 'jobs.json')
        if not os.path.exists(jobs_file):
            self.stdout.write(self.style.ERROR(f'Jobs file not found at {jobs_file}'))
            return

        self.stdout.write('Loading job openings...')
        with open(jobs_file, 'r') as f:
            jobs_data = json.load(f)
        
        jobs_created = 0
        job_objects = {}
        
        for idx, job_data in enumerate(jobs_data):
            try:
                job = JobOpening.objects.create(
                    title=job_data['title'],
                    description=job_data.get('description', ''),
                    positions=job_data.get('positions', 1),
                    department=job_data.get('department', 'Engineering'),
                )
                jobs_created += 1
                job_objects[idx] = job
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error creating job {idx}: {e}'))
        
        self.stdout.write(self.style.SUCCESS(f'Created {jobs_created} job openings.'))

        # Load applications
        applications_file = os.path.join(data_dir, 'applications.json')
        if not os.path.exists(applications_file):
            self.stdout.write(self.style.ERROR(f'Applications file not found at {applications_file}'))
            return

        self.stdout.write('Loading applications...')
        with open(applications_file, 'r') as f:
            applications_data = json.load(f)
        
        applications_created = 0
        applications_skipped = 0
        
        for app_data in applications_data:
            try:
                candidate_idx = app_data['candidate_index']
                job_idx = app_data['job_index']
                
                if candidate_idx not in candidate_objects or job_idx not in job_objects:
                    applications_skipped += 1
                    continue
                
                candidate = candidate_objects[candidate_idx]
                job = job_objects[job_idx]
                
                # Parse the application date
                app_date = datetime.strptime(app_data['applicationDate'], '%Y-%m-%d').date()
                
                # Check if application already exists
                existing = Application.objects.filter(
                    candidate=candidate,
                    job=job,
                    applicationDate=app_date
                ).exists()
                
                if not existing:
                    Application.objects.create(
                        candidate=candidate,
                        job=job,
                        status=app_data['status'],
                        applicationDate=app_date,
                    )
                    applications_created += 1
                else:
                    applications_skipped += 1
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error creating application: {e}'))
                applications_skipped += 1
        
        self.stdout.write(self.style.SUCCESS(f'Created {applications_created} applications, skipped {applications_skipped} existing.'))
        self.stdout.write(self.style.SUCCESS('\nDatabase population completed successfully!'))
        self.stdout.write(self.style.SUCCESS(f'Total records: {candidates_created} candidates, {jobs_created} jobs, {applications_created} applications'))

