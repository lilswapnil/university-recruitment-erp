from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import UserProfile, Candidate

class Command(BaseCommand):
    help = 'Creates demo users for testing'

    def handle(self, *args, **options):
        # Create HR user
        hr_user, created = User.objects.get_or_create(
            username='hr',
            defaults={'email': 'hr@university.edu'}
        )
        if created:
            hr_user.set_password('hr123')
            hr_user.save()
            hr_user.profile.role = 'HR'
            hr_user.profile.save()
            self.stdout.write(self.style.SUCCESS('Created HR user: hr / hr123'))
        else:
            self.stdout.write(self.style.WARNING('HR user already exists'))

        # Create Manager user
        manager_user, created = User.objects.get_or_create(
            username='manager',
            defaults={'email': 'manager@university.edu'}
        )
        if created:
            manager_user.set_password('manager123')
            manager_user.save()
            manager_user.profile.role = 'MANAGER'
            manager_user.profile.save()
            self.stdout.write(self.style.SUCCESS('Created Manager user: manager / manager123'))
        else:
            self.stdout.write(self.style.WARNING('Manager user already exists'))

        # Create Candidate user
        candidate_user, created = User.objects.get_or_create(
            username='candidate',
            defaults={'email': 'candidate@university.edu'}
        )
        if created:
            candidate_user.set_password('candidate123')
            candidate_user.save()
            # Try to link to first candidate
            first_candidate = Candidate.objects.first()
            if first_candidate:
                candidate_user.profile.candidate = first_candidate
            candidate_user.profile.role = 'CANDIDATE'
            candidate_user.profile.save()
            self.stdout.write(self.style.SUCCESS('Created Candidate user: candidate / candidate123'))
        else:
            self.stdout.write(self.style.WARNING('Candidate user already exists'))

        self.stdout.write(self.style.SUCCESS('\nDemo users created successfully!'))

