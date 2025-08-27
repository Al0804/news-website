from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .models import News, Category, UserProfile
from .serializers import (
    NewsSerializer, CategorySerializer, UserSerializer, 
    UserProfileSerializer, RegisterSerializer, LoginSerializer
)

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj.author == request.user

class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.filter(is_published=True)
    serializer_class = NewsSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        elif self.action == 'create':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    def get_queryset(self):
        queryset = News.objects.all()
        if not self.request.user.is_authenticated:
            return queryset.filter(is_published=True)
        if not self.request.user.is_staff:
            return queryset.filter(is_published=True)
        return queryset

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated, permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action == 'retrieve' and str(self.kwargs.get('pk')) == str(self.request.user.id):
            permission_classes = [IsAuthenticated]
        elif self.action in ['update', 'partial_update'] and str(self.kwargs.get('pk')) == str(self.request.user.id):
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated, permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Logout berhasil"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": "Token tidak valid"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    if not request.user.is_staff:
        return Response({"error": "Akses ditolak"}, status=status.HTTP_403_FORBIDDEN)
    
    stats = {
        'total_news': News.objects.count(),
        'published_news': News.objects.filter(is_published=True).count(),
        'total_users': User.objects.count(),
        'total_categories': Category.objects.count(),
    }
    return Response(stats)