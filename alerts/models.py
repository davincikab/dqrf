# from django.contrib.gis.db import models
# from django.conf import settings

# # Create your models here.
# class Alert(models.Model):
#     EMERGENCY_CHOICE = (
#         ('Crime','Crime'),
#         ('Robbery', 'Robbery'),
#         ('Accident', 'Accident'),
#         ('Fire', 'Fire')
#     )

#     STATUS = (
#         ('NEW', 'NEW'),
#         ('RESOLVED', 'RESOLVED'),
#         ('DECLINED', 'DECLINED')
#     )

#     reported_by = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     emergency_type = models.CharField("Type of Emergency", max_length=20, choices=EMERGENCY_CHOICE)
#     time = models.DateTimeField("Occurence Date", auto_now=True, auto_now_add=True)
#     description = models.CharField("Description", max_length=300)
#     status = models.CharField("Emergency Status", max_length=50, choices=STATUS)
#     response_time = models.DateTimeField("Response Time", blank=True)
#     location = models.PointField()
#     responder = models.OneToOneField(settings.AUTH_USER_MODEL, blank=True, on_delete=models.CASCADE)
    

#     class Meta:
#         verbose_name = "Alert"
#         verbose_name_plural = "Alerts"

#     def __str__(self):
#         return self.name

#     # def get_absolute_url(self):
#         # return reverse("Alert_detail", kwargs={"pk": self.pk})

