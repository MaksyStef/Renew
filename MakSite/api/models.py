from django.db import models
from django.urls import reverse

# Create your models here.
class Project(models.Model):
    title = models.CharField(max_length=200, unique=True, null=False, blank=False, primary_key=True)
    details = models.TextField()
    imageSrc = models.URLField(max_length=200)
    url = models.CharField(max_length=200, blank=True, auto_created=True)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("api:project-detail", kwargs={"pk": self.pk})

    def save(self, *args, **kwargs):
        self.url = self.get_absolute_url()
        super().save(*args, **kwargs)