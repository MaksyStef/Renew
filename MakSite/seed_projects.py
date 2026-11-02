''' 

RUN THIS SCRIPT TO POPULATE THE PROJECTS MODEL WITH DUMMIES
    python manage.py shell -c "exec(open('seed_projects.py', encoding='utf-8').read())"

'''


from pathlib import Path

from django.core.files.base import ContentFile

from api.models import Project

IMAGE_PATH = Path(r"C:\Users\noname\Downloads\full_hd_image.jpg")
COUNT = 80
START_ID = 0
image_bytes = IMAGE_PATH.read_bytes()  # read once, reuse for every object

for i in range(START_ID, COUNT + 1):
    project = Project(
        title=f"Test project {i}",
        details=f"Auto-generated project #{i} for testing pagination.",
    )
    # A fresh ContentFile per object: each one gets its own file on disk,
    # named <pk>.jpg by thumbnail_upload_to / Project.save().
    project.thumbnail.save(IMAGE_PATH.name, ContentFile(image_bytes), save=False)
    project.save()
    print(f"Created project {project.pk}: {project.thumbnail.name}")

print(f"Done. Total projects: {Project.objects.count()}")