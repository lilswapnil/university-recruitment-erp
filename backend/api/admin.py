from django.contrib import admin
from .models import Candidate, JobOpening, Application, UserProfile

admin.site.register(Candidate)
admin.site.register(JobOpening)
admin.site.register(Application)
admin.site.register(UserProfile)
