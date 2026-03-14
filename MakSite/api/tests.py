from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIRequestFactory
from unittest.mock import patch, MagicMock

from .models import Project
 
 
# ──────────────────────────────────────────────
# ViewSet / API Tests
# ──────────────────────────────────────────────
 
class ProjectsViewSetTest(APITestCase):
 
    def setUp(self):
        user = User.objects.create_user(username="testuser", password="testpass", is_superuser=True)
        self.client.force_login(user)
        self.project = Project.objects.create(
            title="Alpha",
            details="Alpha details",
            imageSrc="http://example.com/alpha.png",
        )
        # Adjust router basename if yours differs
        self.list_url = reverse("api:project-list")
        self.detail_url = reverse("api:project-detail", kwargs={"pk": self.project.pk})
 
    # --- LIST ---
 
    def test_list_returns_200(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
 
    def test_list_returns_all_projects(self):
        Project.objects.create(title="Beta", details="", imageSrc="")
        response = self.client.get(self.list_url)
        self.assertEqual(len(response.data), 2)
 
    def test_list_contains_expected_fields(self):
        response = self.client.get(self.list_url)
        first = response.data[0]
        self.assertIn("id", first)
        self.assertIn("title", first)
        self.assertIn("details", first)
        self.assertIn("imageSrc", first)
 
    # --- RETRIEVE ---
 
    def test_retrieve_returns_200(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
 
    def test_retrieve_returns_correct_project(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.data["title"], "Alpha")
        self.assertEqual(response.data["details"], "Alpha details")
 
    def test_retrieve_nonexistent_returns_404(self):
        url = reverse("api:project-detail", kwargs={"pk": 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
 
    # --- CREATE ---
 
    def test_create_returns_201(self):
        payload = {"title": "New", "details": "New details", "imageSrc": "http://example.com/persisted.png"}
        response = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
 
    def test_create_persists_to_db(self):
        payload = {"title": "Persisted", "details": "details", "imageSrc": "http://example.com/persisted.png"}
        response = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(response.status_code, 201, msg=f"POST failed with status {response.status_code}: {response.data}")
        self.assertTrue(
            Project.objects.filter(title="Persisted").exists(),
            msg="POST did not persist the project to the database"
        )
 
    def test_create_returns_created_data(self):
        payload = {"title": "Returned", "details": "d", "imageSrc": "http://example.com/persisted.png"}
        response = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(response.data["title"], "Returned")
 
    def test_create_with_missing_title_returns_400(self):
        payload = {"details": "No title", "imageSrc": "http://example.com/persisted.png"}
        response = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
 
    # --- UPDATE (PUT) ---
 
    def test_put_returns_200(self):
        payload = {"title": "Updated", "details": "Updated details", "imageSrc": "http://example.com/persisted.png"}
        response = self.client.put(self.detail_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
 
    def test_put_updates_all_fields(self):
        payload = {"title": "New Title", "details": "New Details", "imageSrc": "http://new.com/img.png"}
        self.client.put(self.detail_url, payload, format="json")
        self.project.refresh_from_db()
        self.assertEqual(self.project.title, "New Title")
        self.assertEqual(self.project.details, "New Details")
 
    # --- PARTIAL UPDATE (PATCH) ---
 
    def test_patch_returns_200(self):
        response = self.client.patch(self.detail_url, {"title": "Patched"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
 
    def test_patch_updates_only_given_field(self):
        original_details = self.project.details
        self.client.patch(self.detail_url, {"title": "Patched"}, format="json")
        self.project.refresh_from_db()
        self.assertEqual(self.project.title, "Patched")
        self.assertEqual(self.project.details, original_details)
 
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