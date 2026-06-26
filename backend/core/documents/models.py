from django.db import models
from projects.models import Project
from users.models import User

class DocumentType(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Document(models.Model):
    project       = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='documents')
    document_type = models.ForeignKey(DocumentType, on_delete=models.SET_NULL, null=True, blank=True, related_name='documents')
    uploaded_by   = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='documents')
    title         = models.CharField(max_length=255)
    file          = models.FileField(upload_to='documents/')
    uploaded_at   = models.DateTimeField(auto_now_add=True)
    is_active     = models.BooleanField(default=True)

    def __str__(self):
        return self.title