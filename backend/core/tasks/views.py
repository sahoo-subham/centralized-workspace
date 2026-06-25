from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Task
from .serializers import TaskSerializer
from teams.permissions import IsAdminOrTeamLeadOrReadOnly, IsAdminOrReadOnly
from django.db.models import Q


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
            return base.filter(
                assigned_to=user
            ).order_by('-id')

    def perform_create(self, serializer):
        if self.request.user.role == 'member':
            raise PermissionDenied('Members cannot create tasks.')
        serializer.save(created_by=self.request.user)


class TaskRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Task.objects.filter(is_active=True)
    serializer_class   = TaskSerializer
    permission_classes = [IsAdminOrTeamLeadOrReadOnly]

    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [IsAdminOrReadOnly()]
        return [IsAdminOrTeamLeadOrReadOnly()]

    def update(self, request, *args, **kwargs):
        task = self.get_object()
        user = request.user

        if user.role == 'member':
            if task.assigned_to != user:
                raise PermissionDenied('You can only update tasks assigned to you.')
            allowed_data = {'status': request.data.get('status', task.status)}
            serializer = self.get_serializer(task, data=allowed_data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        return super().update(request, *args, **kwargs)


    def destroy(self, request, *args, **kwargs):
        task = self.get_object()
        task.is_active = False
        task.save()
        return Response({'message':'Task deactivated successfully.'}, status = status.HTTP_200_OK)