from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # FULL NAME 	
    # REG_NO	
    # EMAIL	
    mobile_no = models.CharField('Phone Number', blank="True", max_length=13)
    residence = models.CharField("Area of Residence", blank="True", max_length=50)


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date_of_birth = models.DateField("Date of Birth", auto_now=False, blank=True)
    photo = models.ImageField("Profile Picture", upload_to="users/%Y/%m/%d", blank=True)

    class Meta:
        verbose_name = "UserProfile"
        verbose_name_plural = "UserProfiles"

    def __str__(self):
        return self.user.username
