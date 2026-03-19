from django.contrib import admin
from .models import Project, Media

# Register your models here.
class ProjectAdmin(admin.ModelAdmin):
    pass
    
class MediaAdmin(admin.ModelAdmin):
    pass

admin.site.register(Project, ProjectAdmin)
admin.site.register(Media, MediaAdmin)