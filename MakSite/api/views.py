from rest_framework import serializers, viewsets
from .models import Project
from .pagination import ProjectsPagination

# Serializers define the API representation.
class ProjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'title', 'details', 'thumbnail', 'url']

# ViewSetsdefine the view behavior.
class ProjectsViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectsSerializer
    pagination_class = ProjectsPagination