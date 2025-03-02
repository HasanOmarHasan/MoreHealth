
from rest_framework import serializers 
from .models import User, DoctorProfile

class UserSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = User 
        fields = ('id', 'username', 'email', 'password', 'age', 'gender', 'phone', 'type', 'city', 'medical_insurance', 'region')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user
        
class DoctorSerializer(serializers.ModelSerializer): 
    user = UserSerializer(required=True)
    
    class Meta: 
        model = DoctorProfile 
        fields = ('user', 'specialization', 'practice_permit')

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data, type='doctor')
        doctor_profile = DoctorProfile.objects.create(
            user=user,
            specialization=validated_data.get('specialization'),
            practice_permit=validated_data.get('practice_permit')
        )
        return doctor_profile
        
