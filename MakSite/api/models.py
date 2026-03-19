from django.db import models
from django.urls import reverse

from .utils.managers import ZipManager

# Create your models here.
class Project(models.Model):
    title = models.CharField(max_length=50)
    details = models.TextField()
    imageSrc = models.URLField(max_length=200)

    @property
    def url(self):
        return self.get_absolute_url()

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("api:project-detail", kwargs={"pk": self.pk})

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)


class Media(models.Model):
    MANAGER_CHOICES = [
        ('zip', 'Zip'),
    ]
    MANAGER_MAP = {
        'zip': ZipManager,
    }

    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='media')
    zip_file = models.FileField(upload_to='project_media/')
    manager_type = models.CharField(max_length=50, choices=MANAGER_CHOICES, default='zip')

    @property
    def manager(self):
        manager_class = self.MANAGER_MAP.get(self.manager_type)
        if manager_class:
            return manager_class(self)
        raise ValueError(f"Unsupported manager type: {self.manager_type}")


    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.manager.unpack()


    def delete(self, *args, **kwargs):
        self.manager.cleanup()
        super().delete(*args, **kwargs)


    def __str__(self):
        return f"Media for {self.project.title}"