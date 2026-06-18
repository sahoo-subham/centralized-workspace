from rest_framework import generics
from .models import Project
from .serializers import ProjectSerializer
from teams.permissions import IsAdminOrTeamLeadOrReadOnly, IsAdminOrReadOnly


class ProjectListCreateView(generics.ListCreateAPIView):
    queryset         = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAdminOrTeamLeadOrReadOnly]


class ProjectRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset         = Project.objects.all()
    serializer_class = ProjectSerializer

    permission_classes = [IsAdminOrTeamLeadOrReadOnly]

    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [IsAdminOrReadOnly()]
        return [IsAdminOrTeamLeadOrReadOnly()]
