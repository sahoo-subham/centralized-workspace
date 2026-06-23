from rest_framework import serializers
from .models import Project
from teams.models import Team
from users.models import User


class TeamMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id','team_name']

class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','name','email']

class ProjectSerializer(serializers.ModelSerializer):
    team_detail       = TeamMiniSerializer(source='team', read_only=True)
    created_by_detail = UserMiniSerializer(source='created_by', read_only=True)

    class Meta:
        model  = Project
        fields = [
            'id', 'title', 'description',
            'team', 'team_detail',
            'status', 'start_date', 'end_date',
            'created_by', 'created_by_detail', 'is_active'
        ]

    def validate(self, data):
        start_date = data.get('start_date', getattr(self.instance, 'start_date', None))
        end_date   = data.get('end_date', getattr(self.instance, 'end_date', None))

        if start_date and end_date:
            if end_date < start_date:
                raise serializers.ValidationError({
                    'end_date': 'End date must be after start date.'
                })

        return data