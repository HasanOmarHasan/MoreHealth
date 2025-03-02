from django.urls import path
from . import views

urlpatterns = [
    path('', views.GroupListCreateView.as_view(), name='group-list'),
    path('<int:pk>/', views.GroupDetailView.as_view(), name='group-detail'),
    path('<int:pk>/join/', views.ToggleMembershipView.as_view(), name='toggle-membership'),
    path('<int:group_pk>/questions/', views.QuestionListCreateView.as_view(), name='question-list'),
    
    path('questions/<int:pk>/', views.QuestionDetailView.as_view(), name='question-detail'),
   path('questions/', views.QuestionListView.as_view(), name='question-list'), 
   
    path('questions/<int:question_pk>/comments/', views.CommentListCreateView.as_view(), name='comment-list'),
    
    # 
    # path('comments/<int:parent_pk>/replies/', views.ReplyCreateView.as_view(), name='reply-create'),
    path('comments/<int:parent_pk>/replies/', views.ReplyListView.as_view(), name='reply-create'),
    
    path('upvote/<str:model_type>/<int:pk>/', views.UpvoteView.as_view(), name='toggle-upvote'),
]