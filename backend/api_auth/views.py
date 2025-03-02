from rest_framework.response import Response
from rest_framework.decorators import api_view  , permission_classes 
from rest_framework import status
from .serializers import UserSerializer , DoctorSerializer
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny 
from .models import User

# /////////
# from django.contrib.auth.models import User
# from rest_framework.parsers import JSONParser
# from rest_framework.decorators import parser_classes

@api_view(['POST'])
@permission_classes([AllowAny]) 
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"message": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)
    user = get_object_or_404(User, email=email)

    if not user.check_password(password):
        return Response({"message": "Invalid password or email"}, status=status.HTTP_401_UNAUTHORIZED)

    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(user)
    return Response({
        'token': token.key,
        'user': serializer.data,
        'status': status.HTTP_200_OK,
        'message': 'Login is Success'
    }, status=status.HTTP_200_OK)
    
    
@api_view(['POST'])
@permission_classes([AllowAny]) 
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        # Save the user instance from the serializer.
        user = serializer.save()
        # Hash the password and update the user.
        user.set_password(request.data["password"])
        user.save()
        token = Token.objects.create(user=user)
        return Response({
            'token': token.key,
            "user": serializer.data,
            "status": status.HTTP_201_CREATED,
            "message": "Account created Success"
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny]) 
def signupDoctor(request):
    serializer = DoctorSerializer(data=request.data)
    if serializer.is_valid():
        doctor_profile = serializer.save()
        user = doctor_profile.user
        token = Token.objects.create(user=user)
        return Response({
            'token': token.key,
            'doctor_profile': serializer.data,
            'status': status.HTTP_201_CREATED,
            'message': 'success'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.decorators import authentication_classes , permission_classes
from rest_framework.permissions import IsAuthenticated 
from rest_framework.authentication import TokenAuthentication , SessionAuthentication

@api_view(['GET'])
@authentication_classes([TokenAuthentication , SessionAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("passed for {} ".format(request.user.email))