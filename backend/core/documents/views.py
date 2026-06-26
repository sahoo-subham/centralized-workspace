from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Document, DocumentType
from .serializers import DocumentSerializer, DocumentTypeSerializer
from teams.permissions import IsAdminOrTeamLeadOrReadOnly, IsAdminOrReadOnly
from django.db.models import Q


class DocumentTypeListCreateView(generics.ListCreateAPIView):
    queryset           = DocumentType.objects.all()
    serializer_class   = DocumentTypeSerializer
    permission_classes = [IsAdminOrReadOnly]

class DocumentTypeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = DocumentType.objects.all()
    serializer_class   = DocumentTypeSerializer
    permission_classes = [IsAdminOrReadOnly]

class DocumentListCreateView(generics.ListCreateAPIView):
    serializer_class   = DocumentSerializer
    permission_classes = [IsAdminOrTeamLeadOrReadOnly]
    parser_classes     = [MultiPartParser, FormParser]

    def get_queryset(self): 
        user = self.request.user
        base = Document.objects.filter(is_active=True)

        if user.role == 'admin':
            return base.order_by('-uploaded_at')

        return base.filter(
            Q(project__team__members__user=user) |
            Q(project__team__created_by=user)
        ).distinct().order_by('-uploaded_at')

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

class DocumentRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    queryset           = Document.objects.filter(is_active=True)
    serializer_class   = DocumentSerializer
    permission_classes = [IsAdminOrTeamLeadOrReadOnly]

    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [IsAdminOrReadOnly()]
        return [IsAdminOrTeamLeadOrReadOnly()]

    def destroy(self, request, *args, **kwargs):
        doc = self.get_object()
        doc.is_active = False
        doc.save()
        return Response(
            {'message': 'Document deleted successfully.'},
            status=status.HTTP_200_OK
        )