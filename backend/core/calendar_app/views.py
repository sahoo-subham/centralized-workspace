from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from tasks.models import Task
from projects.models import Project
from teams.models import TeamMember


class CalendarEventsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if getattr(user, "role", None) == "admin":
            tasks = Task.objects.filter(is_active=True)
            projects = Project.objects.filter(is_active=True)

        elif getattr(user, "role", None) == "team_lead":
            team_ids = TeamMember.objects.filter(user=user).values_list(
                "team_id", flat=True
            )
            tasks = Task.objects.filter(
                is_active=True, project__team_id__in=team_ids
            )
            projects = Project.objects.filter(
                is_active=True, team_id__in=team_ids
            )

        else: 
            tasks = Task.objects.filter(is_active=True, assigned_to=user)
            team_ids = TeamMember.objects.filter(user=user).values_list(
                "team_id", flat=True
            )
            projects = Project.objects.filter(
                is_active=True, team_id__in=team_ids
            )

        events = []

        for t in tasks.select_related("project"):
            if not t.due_date:
                continue
            events.append(
                {
                    "id": f"task-{t.id}",
                    "type": "task",
                    "title": t.title,
                    "start": t.due_date.isoformat(),
                    "end": t.due_date.isoformat(),
                    "allDay": True,
                    "status": t.status,
                    "priority": t.priority,
                    "project": t.project.title if t.project_id else None,
                    "url": f"/dashboard/tasks?task={t.id}",
                }
            )

        for p in projects.select_related("team"):
            if not p.start_date or not p.end_date:
                continue
            events.append(
                {
                    "id": f"project-{p.id}",
                    "type": "project",
                    "title": p.title,
                    "start": p.start_date.isoformat(),
                    "end": p.end_date.isoformat(),
                    "allDay": True,
                    "status": p.status,
                    "team": p.team.team_name if p.team_id else None,
                    "url": f"/dashboard/projects?project={p.id}",
                }
            )

        return Response(events)
