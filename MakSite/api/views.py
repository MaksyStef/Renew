from rest_framework import serializers, viewsets
from .models import Project

# Serializers define the API representation.
class ProjectsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'title', 'details', 'imageSrc']

# ViewSets define the view behavior.
class ProjectsViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectsSerializer