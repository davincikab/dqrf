from django.contrib.gis import admin
from .models import Alert, Response, AlertImage
from leaflet.admin import LeafletGeoAdmin

# Register your models here.
@admin.register(Alert)
class AlertAdmin(LeafletGeoAdmin):
    list_display = ('emergency_type', 'status', 'time', 'location_name', 'reported_by')
    list_filter = ('status', 'description')

@admin.register(AlertImage)
class AlertImageAdmin(admin.ModelAdmin):
    list_display = ('alert', 'image')