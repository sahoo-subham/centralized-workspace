from rest_framework import generics
from .models import Document, DocumentType
from .serializers import DocumentSerializer, DocumentTypeSerializer

class DocumentTypeListCreateView(generics.ListCreateAPIView):
    queryset = DocumentType.objects.all()
    serializer_class = DocumentTypeSerializer

class DocumentTypeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DocumentType.objects.all()
    serializer_class = DocumentTypeSerializer

class DocumentListCreateView(generics.ListCreateAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

class DocumentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer