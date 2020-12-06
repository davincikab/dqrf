from .models import User, UserProfile
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile_signal(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

