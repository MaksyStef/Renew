from django.db import models
from django.urls import reverse

from .utils.unpackagers import ZipUnpackager

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
    UNPACKAGER_CHOICES = [
        ('zip', 'Zip'),
    ]
    UNPACKAGER_MAP = {
        'zip': ZipUnpackager,
    }

    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='media')
    zip_file = models.FileField(upload_to='project_media/')

    @property
    def unpackager(self):
        unpackager_class = self.UNPACKAGER_MAP.get(self.unpackager_type)
        if unpackager_class:
            return unpackager_class(self)
        raise ValueError(f"Unsupported unpackager type: {self.unpackager_type}")

    unpackager_type = models.CharField(max_length=50, choices=UNPACKAGER_CHOICES, default='zip')

    def __str__(self):
        return f"Media for {self.project.title}"