from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from django.conf import settings
from .models import Task
from .serializers import TaskSerializer
from teams.permissions import IsAdminOrTeamLeadOrReadOnly, IsAdminOrReadOnly
from django.db.models import Q


def notify_task_assigned(task):
    """Send an email to the assigned user when a task is created or reassigned."""
    if not task.assigned_to or not task.assigned_to.email:
        return  

    subject = f'New Task Assigned: {task.title}'
    message = (
        f'Hi {task.assigned_to.name},\n\n'
        f'You have been assigned a new task:\n\n'
        f'Title: {task.title}\n'
        f'Project: {task.project.title}\n'
        f'Priority: {task.priority}\n'
        f'Due Date: {task.due_date or "Not set"}\n\n'
        f'Log in to the workspace to view details.'
    )
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[task.assigned_to.email],
        fail_silently=True,  
    )


def notify_status_changed(task, old_status):
    """Send an email to the task creator when the assignee updates the status."""
    if not task.created_by or not task.created_by.email:
        return
    if old_status == task.status:
        return  

    subject = f'Task Status Updated: {task.title}'
    message = (
        f'Hi {task.created_by.name},\n\n'
        f'The status of a task you created has changed:\n\n'
        f'Title: {task.title}\n'
        f'Old Status: {old_status}\n'
        f'New Status: {task.status}\n'
        f'Updated by: {task.assigned_to.name if task.assigned_to else "Unknown"}\n\n'
        f'Log in to the workspace to view details.'
    )
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[task.created_by.email],
        fail_silently=True,
    )

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class   = TaskSerializer
    permission_classes = [IsAdminOrTeamLeadOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        base = Task.objects.filter(is_active=True)

        if user.role == 'admin':
            return base.order_by('-id')

        elif user.role == 'team_lead':
            return base.filter(
                Q(created_by=user) | Q(assigned_to=user)
            ).distinct().order_by('-id')

        else:
            return base.filter(assigned_to=user).order_by('-id')

    def perform_create(self, serializer):
        if self.request.user.role == 'member':
            raise PermissionDenied('Members cannot create tasks.')
        task = serializer.save(created_by=self.request.user)

        notify_task_assigned(task)


class TaskRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Task.objects.filter(is_active=True)
    serializer_class   = TaskSerializer

    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [IsAdminOrReadOnly()]
        if self.request.method == 'PATCH':
            return [IsAuthenticated()]
        return [IsAdminOrTeamLeadOrReadOnly()]

    def update(self, request, *args, **kwargs):
        task = self.get_object()
        user = request.user
        old_status     = task.status
        old_assignee   = task.assigned_to

        if user.role == 'member':
            if task.assigned_to != user:
                raise PermissionDenied('You can only update tasks assigned to you.')
            serializer = self.get_serializer(task, data={'status': request.data.get('status', task.status)}, partial=True)
            serializer.is_valid(raise_exception=True)
            updated_task = serializer.save()

            notify_status_changed(updated_task, old_status)
            return Response(serializer.data)

        response = super().update(request, *args, **kwargs)

        task.refresh_from_db()

        if task.assigned_to and task.assigned_to != old_assignee:
            notify_task_assigned(task)

        notify_status_changed(task, old_status)

        return response

    def destroy(self, request, *args, **kwargs):
        task = self.get_object()
        task.is_active = False
        task.save()
        return Response({'message': 'Task deactivated successfully.'}, status=status.HTTP_200_OK)