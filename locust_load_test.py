import random
import string
import uuid
from locust import HttpUser, task, between

# A minimal valid 1x1 transparent PNG in bytes
MINIMAL_PNG = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82"


class NuxtApiUser(HttpUser):
    # Simulates user thinking time between 1 and 3 seconds
    wait_time = between(1, 3)
    host = "https://ysjegbp2ej.us-east-1.awsapprunner.com"

    def on_start(self):
        """Runs once per user before any tasks begin."""
        self.username = f"user_{''.join(random.choices(string.ascii_lowercase + string.digits, k=8))}"
        self.password = "password"
        self.my_image_ids = []  # Track images uploaded by this specific virtual user

        # Register (Nuxt handles auto-login and session cookie)
        payload = {
            "action": "register",
            "username": self.username,
            "password": self.password,
        }
        with self.client.post(
            "/api/auth", json=payload, name="/api/auth (register)", catch_response=True
        ) as resp:
            if resp.status_code != 200:
                resp.failure(f"Failed to register on start: {resp.status_code}")

    def on_stop(self):
        """Runs once per user when they stop executing tasks."""
        self.client.delete(
            "/api/_auth/session", name="/api/_auth/session (final logout)"
        )

    @task(10)
    def get_all_images(self):
        """Most frequent: simply get all images."""
        self.client.get("/api/images", name="/api/images (get all)")

    @task(5)
    def get_all_and_single(self):
        """Quite frequent: get all images, pick one at random, and fetch it."""
        with self.client.get(
            "/api/images", name="/api/images (get list for single)", catch_response=True
        ) as resp:
            if resp.status_code == 200:
                images = resp.json()
                if images:
                    target_image = random.choice(images)
                    self.client.get(
                        f"/api/images/{target_image['id']}",
                        name="/api/images/[id] (get single)",
                    )

    @task(2)
    def upload_image(self):
        """Medium frequency: Upload a new image."""
        unique_name = f"uploaded_{uuid.uuid4().hex}"
        files = {"file": ("test.png", MINIMAL_PNG, "image/png")}
        data = {"name": unique_name}

        with self.client.post(
            "/api/images/upload",
            files=files,
            data=data,
            name="/api/images/upload",
            catch_response=True,
        ) as resp:
            if resp.status_code == 200:
                # Find the ID of the image we just uploaded so we can delete it later
                with self.client.get(
                    "/api/images",
                    name="/api/images (find uploaded ID)",
                    catch_response=True,
                ) as list_resp:
                    if list_resp.status_code == 200:
                        for img in list_resp.json():
                            if img.get("name") == unique_name:
                                self.my_image_ids.append(img["id"])
                                list_resp.success()
                                break

    @task(1)
    def delete_my_image(self):
        """Low frequency: Delete an image this user owns."""
        if not self.my_image_ids:
            return  # Skip if this user hasn't uploaded anything yet

        image_id = self.my_image_ids.pop()
        with self.client.delete(
            f"/api/images/{image_id}",
            name="/api/images/[id] (delete own)",
            catch_response=True,
        ) as resp:
            if resp.status_code == 200:
                resp.success()
            else:
                resp.failure(f"Failed to delete own image: {resp.status_code}")
                # Re-add to list if delete failed so we don't lose track of it
                self.my_image_ids.append(image_id)

    @task(1)
    def delete_other_image(self):
        """Low frequency: Attempt to delete an image owned by someone else."""
        with self.client.get(
            "/api/images", name="/api/images (find other ID)", catch_response=True
        ) as resp:
            if resp.status_code == 200:
                all_images = resp.json()
                # Filter out any images we know belong to us
                other_images = [
                    img for img in all_images if img["id"] not in self.my_image_ids
                ]

                if other_images:
                    target = random.choice(other_images)
                    with self.client.delete(
                        f"/api/images/{target['id']}",
                        name="/api/images/[id] (delete other)",
                        catch_response=True,
                    ) as del_resp:
                        # We expect a 401 or 403 here because it's not our image
                        if del_resp.status_code in [401, 403]:
                            del_resp.success()
                        else:
                            del_resp.failure(
                                f"Expected Auth error (401/403), got {del_resp.status_code}"
                            )

