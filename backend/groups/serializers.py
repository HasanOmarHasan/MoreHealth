from rest_framework import serializers
from .models import Group, Question, Comment
from django.contrib.auth import get_user_model
from taggit.serializers import TagListSerializerField
from django_filters import rest_framework as filters

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class GroupSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    members = UserSerializer(many=True, read_only=True)
    tags = TagListSerializerField(required=False)

    class Meta:
        model = Group
        fields = ['id', 'name', 'description', 'image', 'creator', 'members', 'created_at' , 'tags']
        read_only_fields = ['creator', 'members', 'created_at']

class QuestionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    upvotes = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'title', 'content', 'group', 'user', 'created_at', 'upvotes']
        read_only_fields = ['group', 'user', 'created_at', 'upvotes']

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    upvotes = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'content', 'question', 'user', 'parent', 'created_at', 'upvotes', 'replies']
        read_only_fields = ['question', 'user', 'created_at', 'upvotes', 'replies']

    def get_replies(self, obj):
        replies = Comment.objects.filter(parent=obj)
        return CommentSerializer(replies, many=True).data
    
    
class GroupFilter(filters.FilterSet):
    
    tags = filters.CharFilter(method='filter_tags')
    created_after = filters.DateFilter(
        field_name='created_at', 
        lookup_expr='gte',
        label='Created after (YYYY-MM-DD)'
    )
    created_before = filters.DateFilter(
        field_name='created_at', 
        lookup_expr='lte',
        label='Created before (YYYY-MM-DD)'
    )
    min_members = filters.NumberFilter(
        method='filter_min_members',
        label='Minimum number of members'
    )
    creator = filters.ModelChoiceFilter(
        queryset=User.objects.all(),
        field_name='creator__username'
    )
    member = filters.CharFilter(
        method='filter_member',
        label='Filter groups containing member (username)'
    )

    class Meta:
        model = Group
        fields = {
            'name': ['exact', 'icontains'],
            'tags__name': ['exact'],  # Remove icontains here
        }
    def filter_min_members(self, queryset, name, value):
        return queryset.annotate(member_count=Count('members'))\
                      .filter(member_count__gte=value)

    def filter_member(self, queryset, name, value):
        return queryset.filter(members__username=value)
    def filter_tags(self, queryset, name, value):
        return queryset.filter(tags__name__in=value.split(','))

    # Add this for current user's groups
    @property
    def qs(self):
        qs = super().qs
        if 'my_groups' in self.request.GET:
            return qs.filter(members=self.request.user)
        return qs
    
    
    
  

   