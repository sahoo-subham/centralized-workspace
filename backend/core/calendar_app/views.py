from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from tasks.models import Task
from projects.models import Project
from teams.models import Team, TeamMember


class CalendarEventsView(APIView):
    """
    GET /api/calendar/events/

    Returns a flat, role-scoped list of task deadlines and project
    date ranges, shaped for FullCalendar's event feed.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        role = getattr(user, "role", None)

        if role == "admin":
            tasks = Task.objects.filter(is_active=True)
            projects = Project.objects.filter(is_active=True)

        elif role == "team_lead":
            team_ids = (
                Team.objects.filter(
                    Q(created_by=user) | Q(members__user=user)
                )
                .values_list("id", flat=True)
                .distinct()
            )
            tasks = Task.objects.filter(
                is_active=True, project__team_id__in=team_ids
            )
            projects = Project.objects.filter(
                is_active=True, team_id__in=team_ids
            )

        elif role == "member":
            tasks = Task.objects.filter(is_active=True, assigned_to=user)
            team_ids = TeamMember.objects.filter(user=user).values_list(
                "team_id", flat=True
            )
            projects = Project.objects.filter(
                is_active=True, team_id__in=team_ids
            )

        else:
            tasks = Task.objects.none()
            projects = Project.objects.none()

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