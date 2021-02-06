from django.dispatch import receiver
from django.db.models.signals import post_save
from django.core import serializers

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import Alert
import json

@receiver(post_save, sender=Alert)
def create_alert(sender, instance, created,**kwargs):
    if created:
        print("Alert Created")

        # broadcast the alert
        message = serializers.serialize('geojson', [instance])
        print(message)

        channel_layer = get_channel_layer()
        print(channel_layer)

        async_to_sync(channel_layer.group_send)(
            'chat_group_alerts',
            {
                'type': 'send_alert_message', 
                'message': str(message)
            }
        )
