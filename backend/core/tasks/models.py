from django.db import models
from projects.models import Project
from users.models import User

class Task(models.Model):
    STATUS_CHOICES = [
        ('pending',     'Pending'),
        ('in_progress', 'In Progress'),
        ('completed',   'Completed'),
    ]

    PRIORITY_CHOICES = [
        ('low',    'Low'),
        ('medium', 'Medium'),
        ('high',   'High'),
    ]

    project     = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tasks')
    title       = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_by  = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_tasks')
    status   = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    due_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.title