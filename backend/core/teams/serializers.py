from rest_framework import serializers
from .models import Team, TeamMember

class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ['id', 'team', 'name', 'role']  
class TeamSerializer(serializers.ModelSerializer):
    members = TeamMemberSerializer(source='teammember_set',  many=True,read_only=True)

    class Meta:
        model = Team
        fields = ['id', 'team_name', 'description', 'created_by', 'members']