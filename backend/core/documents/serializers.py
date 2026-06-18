from rest_framework import serializers
from .models import Document, DocumentType
from projects.models import Project


class ProjectMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id','title']



class DocumentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentType
        fields = '__all__'

class DocumentSerializer(serializers.ModelSerializer):
    project_detail = ProjectMiniSerializer(source = 'project', read_only = True)
    class Meta:
        model = Document
        fields = '__all__'