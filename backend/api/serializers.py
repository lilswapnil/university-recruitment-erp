from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Candidate, JobOpening, Application, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'role', 'candidate']

class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = '__all__'

class JobOpeningSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOpening
        fields = '__all__'

class ApplicationSerializer(serializers.ModelSerializer):
    # Send readable names to the frontend
    candidate_name = serializers.CharField(source='candidate.__str__', read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)
    job_department = serializers.CharField(source='job.department', read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'candidate', 'job', 'applicationDate', 'status', 'candidate_name', 'job_title', 'job_department']
        # 'candidate' and 'job' are write-only (for POST), names are read-only (for GET)
        extra_kwargs = {
            'candidate': {'write_only': True},
            'job': {'write_only': True},
        }
