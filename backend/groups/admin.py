from django.contrib import admin
from .models import Group, Question, Comment

admin.site.register(Group)
admin.site.register(Question)
admin.site.register(Comment)