from django.contrib.gis import admin
from .models import Alert

# Register your models here.
@admin.register(Alert)
class AlertAdmin(admin.OSMGeoAdmin):
    list_display = ('reported_by', 'status', 'time')
