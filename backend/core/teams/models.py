from django.db import models
from users.models import User

class Team(models.Model):
    team_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.team_name

class TeamMember(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        unique_together = ('team', 'user')  # prevents duplicate membership

    def __str__(self):
        return f"{self.user} in {self.team}"