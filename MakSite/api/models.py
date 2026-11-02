import os

from django.db import models
from django.db.models.signals import post_delete
from django.urls import reverse
from django.dispatch import receiver

from .utils.managers import ZipManager

# Create your models here.
def thumbnail_upload_to(instance, filename):
    ext = os.path.splitext(filename)[1].lower()
    return f"images/thumbnails/{instance.pk}{ext}"


class Project(models.Model):
    title = models.CharField(max_length=50)
    details = models.TextField()
    thumbnail = models.ImageField(upload_to=thumbnail_upload_to)

    @property
    def url(self):
        return self.get_absolute_url()

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("api:project-detail", kwargs={"pk": self.pk})

    def save(self, *args, **kwargs):
        if self.pk is None:
            # Creating: no pk yet, so insert the row first, then attach the file.
            thumbnail = self.thumbnail
            if thumbnail:
                self.thumbnail = ""
                super().save(*args, **kwargs)
                self.thumbnail = thumbnail
                super().save(update_fields=["thumbnail"], using=kwargs.get("using"))
                return
        else:
            # Updating: if a new file was uploaded, remove the old one first so
            # the new file can take the same "<pk>.<ext>" name instead of getting
            # a random suffix appended by Django's storage.
            old = Project.objects.filter(pk=self.pk).first()
            if old and old.thumbnail and not self.thumbnail._committed:
                old.thumbnail.delete(save=False)

        super().save(*args, **kwargs)


@receiver(post_delete, sender=Project)
def delete_thumbnail_file(sender, instance, **kwargs):
    if instance.thumbnail:
        instance.thumbnail.delete(save=False)


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