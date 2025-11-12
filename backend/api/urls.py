from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CandidateViewSet, JobOpeningViewSet, ApplicationViewSet, AuthViewSet, NotificationViewSet

router = DefaultRouter()
router.register(r'candidates', CandidateViewSet)
router.register(r'jobs', JobOpeningViewSet)
router.register(r'applications', ApplicationViewSet)
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'notifications', NotificationViewSet, basename='notifications')

urlpatterns = [
    path('', include(router.urls)),
]
