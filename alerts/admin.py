from django.contrib.gis import admin
from .models import Alert
from leaflet.admin import LeafletGeoAdmin

# Register your models here.
@admin.register(Alert)
class AlertAdmin(LeafletGeoAdmin):
    list_display = ('reported_by', 'status', 'time')
