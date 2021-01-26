from django.db import models
from django.contrib.auth import get_user_model
from alerts.models import Alert

User = get_user_model()

# Create your models here.
class Message(models.Model):
    is_read = models.BooleanField("Is Read", default=False)
    time = models.DateTimeField("Response Time", auto_now=True)
    author = models.ForeignKey(User, related_name="author", on_delete=models.CASCADE)
    text = models.TextField("Response")
    alert = models.ForeignKey(Alert, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Message"
        verbose_name_plural = "Messages"
        ordering = ("time", )

    def __str__(self):
        return self.text
