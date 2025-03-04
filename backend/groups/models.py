from django.db import models
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.contrib.auth.models import User 
from taggit.managers import TaggableManager


User = get_user_model()

class Group(models.Model):
    name = models.CharField("اسم المجموعة", max_length=100, unique=True)
    description = models.TextField("الوصف")
    image = models.ImageField("صورة المجموعة", upload_to='groups/', blank=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_groups')
    members = models.ManyToManyField(User, related_name='joined_groups')
    created_at = models.DateTimeField("تاريخ الإنشاء", auto_now_add=True)
    tags = TaggableManager("الوسوم", blank=True)

    def get_absolute_url(self):
        return reverse('groups:detail', kwargs={'pk': self.pk})

    def __str__(self):
        return self.name

class Question(models.Model):
    title = models.CharField("العنوان", max_length=200)
    content = models.TextField("المحتوى")
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='questions')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='questions')
    created_at = models.DateTimeField("تاريخ النشر", auto_now_add=True)
    upvotes = models.ManyToManyField(User, related_name='upvoted_questions', blank=True)

    class Meta:
        ordering = ['-created_at']

    def total_upvotes(self):
        return self.upvotes.count()

class Comment(models.Model):
    content = models.TextField("التعليق")
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')  # لدعم الردود
    created_at = models.DateTimeField("تاريخ التعليق", auto_now_add=True)
    upvotes = models.ManyToManyField(User, related_name='upvoted_comments', blank=True)

    def total_upvotes(self):
        return self.upvotes.count()

    def is_reply(self):
        return self.parent is not None  # للتحقق إذا كان هذا تعليقًا أم ردًا
