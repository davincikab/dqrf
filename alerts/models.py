from django.contrib.gis.db import models
from django.conf import settings

# Create your models here.
class Alert(models.Model):
    EMERGENCY_CHOICE = (
        ('Crime','Crime'),
        ('Robbery', 'Robbery'),
        ('Accident', 'Accident'),
        ('Fire', 'Fire')
    )

    STATUS = (
        ('NEW', 'NEW'),
        ('RESOLVED', 'RESOLVED'),
        ('DECLINED', 'DECLINED')
    )

    reported_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    emergency_type = models.CharField("Type of Emergency", max_length=20, choices=EMERGENCY_CHOICE)
    time = models.DateTimeField("Occurence Date", auto_now=True)
    description = models.CharField("Description", max_length=300)
    status = models.CharField("Emergency Status", max_length=50, choices=STATUS)
    response_time = models.DateTimeField("Response Time", blank=True, null=True)
    location = models.PointField()
    location_name = models.CharField("Location Name", max_length=50)
    image = models.ImageField("Profile Picture", upload_to="alerts/%Y/%m/%d", blank=True)
    responder = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="responseder", blank=True, on_delete=models.CASCADE)
    

    class Meta:
        verbose_name = "Alert"
        verbose_name_plural = "Alerts"

    def __str__(self):
        return self.emergency_type

    # def get_absolute_url(self):
    #     return reverse("alert_detail", kwargs={"pk": self.pk})


class Response(models.Model):
    is_declined = models.BooleanField("Is Declined", default=False)
    responded_on = models.DateTimeField("Response Time", auto_now=False, auto_now_add=False)
    responded_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="user_from", on_delete=models.CASCADE)
    responded_to = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="user_to", on_delete=models.CASCADE)
    response = models.TextField("Response")
    alert = models.ForeignKey(Alert, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Response"
        verbose_name_plural = "Responses"

    def __str__(self):
        return self.response

    # def get_absolute_url(self):
    #     return reverse("Response_detail", kwargs={"pk": self.pk})
