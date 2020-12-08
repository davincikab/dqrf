from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer

from alerts.models import Alert


class AlertSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Alert
        geo_field = 'location'
        fields = ('pk','status', 'reported_by', 'emergency_type', 'description', 'location','time', 'response_time', 'location_name', 'image')
