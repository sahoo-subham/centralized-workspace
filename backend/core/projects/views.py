from rest_framework import generics, status
from rest_framework.response import Response
from .models import Project
from .serializers import ProjectSerializer
from teams.permissions import IsAdminOrTeamLeadOrReadOnly, IsAdminOrReadOnly


class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class   = ProjectSerializer
    permission_classes = [IsAdminOrTeamLeadOrReadOnly]

    def get_queryset(self):
        return Project.objects.filter(is_active=True).order_by('-id')


class ProjectRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Project.objects.all()
    serializer_class   = ProjectSerializer
    permission_classes = [IsAdminOrTeamLeadOrReadOnly]

    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [IsAdminOrReadOnly()]
        return [IsAdminOrTeamLeadOrReadOnly()]

    def destroy(self, request, *args, **kwargs):
        project = self.get_object()
        project.is_active = False
        project.save()
        return Response(
            {'message': 'Project deactivated successfully.'},
            status=status.HTTP_200_OK
        )