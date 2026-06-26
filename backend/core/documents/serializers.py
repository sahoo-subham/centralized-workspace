from rest_framework import serializers
from .models import Document, DocumentType
from projects.models import Project
from users.models import User

class DocumentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model  = DocumentType
        fields = ['id', 'name']

class ProjectMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Project
        fields = ['id', 'title']

class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id', 'name', 'email']

class DocumentSerializer(serializers.ModelSerializer):
    project_detail       = ProjectMiniSerializer(source='project', read_only=True)
    uploaded_by_detail   = UserMiniSerializer(source='uploaded_by', read_only=True)
    document_type_detail = DocumentTypeSerializer(source='document_type', read_only=True)

    file_url = serializers.SerializerMethodField()

    class Meta:
        model  = Document
        fields = [
            'id', 'title',
            'project', 'project_detail',
            'document_type', 'document_type_detail',
            'uploaded_by', 'uploaded_by_detail',
            'file', 'file_url',
            'uploaded_at', 'is_active',
        ]

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None