
from django.db import models
from django.contrib.auth.models import AbstractUser , Group, Permission

class User(AbstractUser):
    USERNAME_FIELD = 'email'  
    REQUIRED_FIELDS = ['username']
    
    USER_TYPYE_CHOICES = (
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
    )
    GENDER = (
        ('male', 'Male'),
        ('female', 'Female'),
    )
    
    email = models.EmailField(unique=True , null=False, blank=False)
    username = models.CharField(max_length=100, unique=False, null=True, blank=True)
    type = models.CharField(max_length=10, choices=USER_TYPYE_CHOICES, default='patient')
    age = models.IntegerField(default=0 , null=True)
    gender = models.CharField(max_length=10 , null=True, blank=True , choices=GENDER)
    phone = models.CharField(max_length=20)
    city = models.CharField(max_length=100 , blank=True)
    region = models.CharField(max_length=100 , null=True, blank=True)
    medical_insurance = models.BooleanField(default=False , null=True, blank=True )
    
    
    groups = models.ManyToManyField(
        Group,
        verbose_name='groups',
        blank=True,
        related_name="api_auth_groups",  
        related_query_name="api_auth",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='user permissions',
        blank=True,
        related_name="api_auth_permissions", 
        related_query_name="api_auth",
    )
    

class DoctorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE , related_name='doctor_profile')
    specialization = models.CharField(max_length=100)
    practice_permit = models.CharField(max_length=100)
    
