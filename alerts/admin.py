from django.contrib.gis import admin
from .models import Alert, Response
from leaflet.admin import LeafletGeoAdmin

# Register your models here.
@admin.register(Alert)
class AlertAdmin(LeafletGeoAdmin):
    list_display = ('reported_by', 'status', 'time')
    list_filter = ('status', 'description')

@admin.register(Response)
class ResponseAdmin(admin.ModelAdmin):
    list_display = ('response', 'responded_on', 'responded_by', 'responded_to')
    search_fields = ('response', 'responded on')
    list_filter = ('is_declined')