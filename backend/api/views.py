from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import Candidate, JobOpening, Application, UserProfile
from .serializers import (
    CandidateSerializer, JobOpeningSerializer, ApplicationSerializer,
    UserProfileSerializer
)

class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAuthenticated()]

class JobOpeningViewSet(viewsets.ModelViewSet):
    queryset = JobOpening.objects.all()
    serializer_class = JobOpeningSerializer
    
    def get_permissions(self):
        return [IsAuthenticated()]

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    
    def get_permissions(self):
        return [IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Application.objects.all().order_by('-applicationDate')
        
        # Role-based filtering
        if hasattr(user, 'profile'):
            role = user.profile.role
            
            if role == 'CANDIDATE' and user.profile.candidate:
                # Candidates see only their applications
                queryset = queryset.filter(candidate=user.profile.candidate)
            elif role == 'MANAGER':
                # Managers see applications for their department (if we add department to user)
                pass  # For now, managers see all
            elif role == 'HR':
                # HR sees all applications
                pass
        
        # Filter by candidate_id if provided
        candidate_id = self.request.query_params.get('candidate_id')
        if candidate_id is not None:
            queryset = queryset.filter(candidate__id=candidate_id)
        
        # Filter by status if provided
        status_filter = self.request.query_params.get('status')
        if status_filter is not None:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by department if provided
        department_filter = self.request.query_params.get('department')
        if department_filter is not None:
            queryset = queryset.filter(job__department=department_filter)
        
        return queryset
    
    def create(self, request):
        user = request.user
        candidate_id = request.data.get('candidate')
        
        # For candidates, use their linked candidate
        if hasattr(user, 'profile') and user.profile.role == 'CANDIDATE':
            if user.profile.candidate:
                candidate_id = user.profile.candidate.id
            else:
                return Response(
                    {'error': 'Candidate profile not linked. Please contact administrator.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        if not candidate_id:
            return Response(
                {'error': 'Candidate ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(candidate_id=candidate_id)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Username and password required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            profile = user.profile
            serializer = UserProfileSerializer(profile)
            return Response({
                'user': serializer.data,
                'message': 'Login successful'
            })
        else:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        logout(request)
        return Response({'message': 'Logout successful'})
    
    @action(detail=False, methods=['get'])
    def current_user(self, request):
        if request.user.is_authenticated:
            profile = request.user.profile
            serializer = UserProfileSerializer(profile)
            return Response({'user': serializer.data})
        return Response(
            {'error': 'Not authenticated'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        role = request.data.get('role', 'CANDIDATE')
        candidate_id = request.data.get('candidate_id')
        
        if not username or not password:
            return Response(
                {'error': 'Username and password required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email or ''
        )
        
        profile = user.profile
        profile.role = role
        if candidate_id:
            try:
                candidate = Candidate.objects.get(id=candidate_id)
                profile.candidate = candidate
            except Candidate.DoesNotExist:
                pass
        profile.save()
        
        login(request, user)
        serializer = UserProfileSerializer(profile)
        return Response({
            'user': serializer.data,
            'message': 'Registration successful'
        }, status=status.HTTP_201_CREATED)
