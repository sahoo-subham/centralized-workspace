from rest_framework import generics
from .models import Task
from .serializers import TaskSerializer
from teams.permissions import IsAdminOrTeamLeadOrReadOnly, IsAdminOrReadOnly

class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAdminOrTeamLeadOrReadOnly]


class TaskRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    permission_classes = [IsAdminOrTeamLeadOrReadOnly]

    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [IsAdminOrReadOnly()]
        return [IsAdminOrTeamLeadOrReadOnly()]
