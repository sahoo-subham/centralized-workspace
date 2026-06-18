from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Team, TeamMember
from .serializers import TeamSerializer, TeamMemberSerializer
from .permissions import IsAdminOrTeamLeadOrReadOnly, IsAdminOrReadOnly
from django.db.models import Q


class TeamListCreateView(generics.ListCreateAPIView):
    serializer_class = TeamSerializer
    permission_classes = [IsAdminOrTeamLeadOrReadOnly]

    def get_queryset(self):
        user = self.request.user

        if user.role == "admin":
            base = Team.objects.filter(is_active=True)
        elif user.role == "team_lead":
            base = Team.objects.filter(
                Q(created_by=user) | Q(members__user=user),
                is_active=True,
            ).distinct()
        else:
            base = Team.objects.filter(members__user=user, is_active=True).distinct()

        return base.order_by("-id")

    def perform_create(self, serializer):
        if self.request.user.role != "admin":
            raise PermissionDenied("Only an admin can create a new team.")
        serializer.save(created_by=self.request.user)


class TeamRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset         = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAdminOrTeamLeadOrReadOnly]

    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [IsAdminOrReadOnly()]
        return [IsAdminOrTeamLeadOrReadOnly()]

    def destroy(self, request, *args, **kwargs):
        team = self.get_object()
        team.is_active = False
        team.save()
        return Response(
            {'message': 'Team deactivated successfully.'},
            status=status.HTTP_200_OK
        )


class TeamMemberListCreateView(generics.ListCreateAPIView):
    queryset         = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [IsAdminOrTeamLeadOrReadOnly]


class TeamMemberRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset         = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [IsAdminOrTeamLeadOrReadOnly]

    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [IsAdminOrReadOnly()]
        return [IsAdminOrTeamLeadOrReadOnly()]