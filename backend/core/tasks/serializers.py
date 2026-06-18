from rest_framework import serializers
from .models import Task
from projects.models import Project
from users.models import User


class ProjectMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id','title']


class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','name','email']


class TaskSerializer(serializers.ModelSerializer):
    project_detail = ProjectMiniSerializer(source = 'project', read_only = True)
    assigned_to_detail = UserMiniSerializer(source = 'assigned_to',read_only = True)
    created_by_detail = UserMiniSerializer(source = 'created_by', read_only = True)

    class Meta:
        model = Task
        fields = ['id','title','description','project','project_detail','assigned_to','assigned_to_detail','created_by','created_by_detail','status','priority','due_date']

