from django.db import models
from django.conf import settings

# Create your models here
class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date_of_birth = models.DateField("Date of Birth", auto_now=False, auto_now_add=False)
    photo = models.ImageField("Profile Picture", upload_to="users/%Y/%m/%d", blank=True)

    class Meta:
        verbose_name = "UserProfile"
        verbose_name_plural = "UserProfiles"

    def __str__(self):
        return self.user.username
