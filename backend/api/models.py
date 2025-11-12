from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
import os

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('CANDIDATE', 'Candidate'),
        ('MANAGER', 'Manager'),
        ('HR', 'HR'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='CANDIDATE')
    candidate = models.ForeignKey('Candidate', on_delete=models.SET_NULL, null=True, blank=True, related_name='user_profiles')
    
    def __str__(self):
        return f"{self.user.username} - {self.role}"

class Candidate(models.Model):
    fName = models.CharField(max_length=50)
    lName = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    bio = models.TextField(blank=True, max_length=500)
    linkedin = models.URLField(blank=True)
    portfolio = models.URLField(blank=True)
    
    def __str__(self):
        return f"{self.fName} {self.lName}"

class JobOpening(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    positions = models.IntegerField(default=1)
    department = models.CharField(max_length=100, default="Engineering")

    def __str__(self):
        return self.title

class Application(models.Model):
    STATUS_CHOICES = [
        ('Received', 'Received'),
        ('Under Review', 'Under Review'),
        ('Interview', 'Interview'),
        ('Offer Extended', 'Offer Extended'),
        ('Rejected', 'Rejected'),
        ('Withdrawn', 'Withdrawn'),
    ]
    
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(JobOpening, on_delete=models.CASCADE, related_name='applications')
    applicationDate = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Received')
    coverLetter = models.TextField(blank=True)

    def __str__(self):
        return f"{self.candidate} for {self.job}"

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('NEW_JOB', 'New Job Posting'),
        ('APPLICATION_UPDATE', 'Application Status Update'),
        ('INTERVIEW', 'Interview Scheduled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    job = models.ForeignKey(JobOpening, on_delete=models.CASCADE, null=True, blank=True)
    application = models.ForeignKey(Application, on_delete=models.CASCADE, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.get_or_create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()
