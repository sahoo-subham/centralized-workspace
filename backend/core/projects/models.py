from django.db import models
from teams.models import Team
from users.models import User


class Project(models.Model):
    STATUS_CHOICES = [
        ('pending',   'Pending'),
        ('active',    'Active'),
        ('completed', 'Completed'),
        ('on_hold',   'On Hold'),
    ]

    team        = models.ForeignKey(Team, on_delete=models.CASCADE)
    created_by  = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_projects')
    title       = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    start_date  = models.DateField(blank=True, null=True)
    end_date    = models.DateField(blank=True, null=True)
    status      = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    is_active   = models.BooleanField(default=True)

    def __str__(self):
        return self.title