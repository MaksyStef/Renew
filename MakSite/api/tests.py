import shutil
import tempfile
from io import BytesIO

from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from django.urls import reverse
from PIL import Image
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Project


# ──────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────

TEMP_MEDIA_ROOT = tempfile.mkdtemp()


def make_image(name="test.png", size=(10, 10), color=(255, 0, 0)):
    """Return a fresh, valid in-memory PNG upload.

    Create a new one for every request: an uploaded file is consumed
    once it has been read.
    """
    buffer = BytesIO()
    Image.new("RGB", size, color).save(buffer, format="PNG")
    return SimpleUploadedFile(name, buffer.getvalue(), content_type="image/png")


# ──────────────────────────────────────────────
# ViewSet / API Tests
# ──────────────────────────────────────────────

@override_settings(MEDIA_ROOT=TEMP_MEDIA_ROOT)
class ProjectsViewSetTest(APITestCase):

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(TEMP_MEDIA_ROOT, ignore_errors=True)
        super().tearDownClass()

    def setUp(self):
        user = User.objects.create_user(username="testuser", password="testpass", is_superuser=True)
        self.client.force_login(user)
        self.project = Project.objects.create(
            title="Alpha",
            details="Alpha details",
            thumbnail=make_image("alpha.png"),
        )
        # Adjust router basename if yours differs
        self.list_url = reverse("api:project-list")
        self.detail_url = reverse("api:project-detail", kwargs={"pk": self.project.pk})

    # --- LIST ---

    def test_list_returns_200(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_returns_all_projects(self):
        Project.objects.create(title="Beta", details="", thumbnail=make_image("beta.png"))
        response = self.client.get(self.list_url)
        self.assertEqual(len(response.data), 2)

    def test_list_contains_expected_fields(self):
        response = self.client.get(self.list_url)
        first = response.data[0]
        self.assertIn("id", first)
        self.assertIn("title", first)
        self.assertIn("details", first)
        self.assertIn("thumbnail", first)

    def test_list_thumbnail_is_a_url(self):
        response = self.client.get(self.list_url)
        self.assertIn("alpha", response.data[0]["thumbnail"])

    # --- RETRIEVE ---

    def test_retrieve_returns_200(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_returns_correct_project(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.data["title"], "Alpha")
        self.assertEqual(response.data["details"], "Alpha details")
        self.assertIn("alpha", response.data["thumbnail"])

    def test_retrieve_nonexistent_returns_404(self):
        url = reverse("api:project-detail", kwargs={"pk": 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # --- CREATE ---

    def test_create_returns_201(self):
        payload = {"title": "New", "details": "New details", "thumbnail": make_image("new.png")}
        response = self.client.post(self.list_url, payload, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_persists_to_db(self):
        payload = {"title": "Persisted", "details": "details", "thumbnail": make_image("persisted.png")}
        response = self.client.post(self.list_url, payload, format="multipart")
        self.assertEqual(
            response.status_code, 201,
            msg=f"POST failed with status {response.status_code}: {response.data}",
        )
        project = Project.objects.filter(title="Persisted").first()
        self.assertIsNotNone(project, msg="POST did not persist the project to the database")
        self.assertTrue(project.thumbnail, msg="POST did not store the thumbnail file")

    def test_create_returns_created_data(self):
        payload = {"title": "Returned", "details": "d", "thumbnail": make_image("returned.png")}
        response = self.client.post(self.list_url, payload, format="multipart")
        self.assertEqual(response.data["title"], "Returned")
        self.assertIn("returned", response.data["thumbnail"])

    def test_create_with_missing_title_returns_400(self):
        payload = {"details": "No title", "thumbnail": make_image("notitle.png")}
        response = self.client.post(self.list_url, payload, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_with_missing_thumbnail_returns_400(self):
        # Remove this test if thumbnail is optional (blank=True / null=True)
        payload = {"title": "No thumb", "details": "d"}
        response = self.client.post(self.list_url, payload, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_with_non_image_file_returns_400(self):
        bad_file = SimpleUploadedFile("not_image.txt", b"definitely not an image", content_type="text/plain")
        payload = {"title": "Bad", "details": "d", "thumbnail": bad_file}
        response = self.client.post(self.list_url, payload, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("thumbnail", response.data)

    # --- UPDATE (PUT) ---

    def test_put_returns_200(self):
        payload = {"title": "Updated", "details": "Updated details", "thumbnail": make_image("updated.png")}
        response = self.client.put(self.detail_url, payload, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_put_updates_all_fields(self):
        payload = {"title": "New Title", "details": "New Details", "thumbnail": make_image("new_thumb.png")}
        self.client.put(self.detail_url, payload, format="multipart")
        self.project.refresh_from_db()
        self.assertEqual(self.project.title, "New Title")
        self.assertEqual(self.project.details, "New Details")
        self.assertIn("new_thumb", self.project.thumbnail.name)

    # --- PARTIAL UPDATE (PATCH) ---

    def test_patch_returns_200(self):
        response = self.client.patch(self.detail_url, {"title": "Patched"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch_updates_only_given_field(self):
        original_details = self.project.details
        original_thumbnail = self.project.thumbnail.name
        self.client.patch(self.detail_url, {"title": "Patched"}, format="json")
        self.project.refresh_from_db()
        self.assertEqual(self.project.title, "Patched")
        self.assertEqual(self.project.details, original_details)
        self.assertEqual(self.project.thumbnail.name, original_thumbnail)

    def test_patch_can_replace_thumbnail(self):
        payload = {"thumbnail": make_image("patched_thumb.png")}
        response = self.client.patch(self.detail_url, payload, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.project.refresh_from_db()
        self.assertIn("patched_thumb", self.project.thumbnail.name)

    # --- DELETE ---

    def test_delete_returns_204(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_removes_from_db(self):
        self.client.delete(self.detail_url)
        self.assertFalse(Project.objects.filter(pk=self.project.pk).exists())

    def test_delete_nonexistent_returns_404(self):
        url = reverse("api:project-detail", kwargs={"pk": 9999})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)