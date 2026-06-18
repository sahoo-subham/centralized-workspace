from rest_framework import serializers
from .models import Team, TeamMember
from users.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id', 'name', 'email', 'role']


class TeamMemberSerializer(serializers.ModelSerializer):
    user_detail = UserSerializer(source='user', read_only=True)

    class Meta:
        model  = TeamMember
        fields = ['id', 'team', 'user', 'user_detail', 'role']


class TeamSerializer(serializers.ModelSerializer):
    members = TeamMemberSerializer(many=True, read_only=True)
    created_by_detail = UserSerializer(source='created_by', read_only=True)

    class Meta:
        model  = Team
        fields = ['id', 'team_name', 'description', 'created_by', 'created_by_detail', 'members', 'is_active']