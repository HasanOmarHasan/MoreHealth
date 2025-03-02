from django.urls import path
from . import views

urlpatterns = [
    path('login', views.login, name='auth-login'),
    path('signup', views.signup, name='auth-signup'),
    path('signup-doctor', views.signupDoctor, name='auth-signup-doctor'),
    path('test-token', views.test_token, name='auth-test-token'),
]