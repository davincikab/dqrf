from django.dispatch import receiver
from django.db.models.signals import post_save
from django.core import serializers

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import Message
import json

@receiver(post_save, sender=Message)
def create_alert(sender, instance, created,**kwargs):
    if created:
        print("Message Created")

        # broadcast the alert
        channel_layer = get_channel_layer()
        print(channel_layer)
        
        room_name = 'chat_%s' % instance.alert.pk

        print(room_name)
        try:
            image = instance.image.url
        except ValueError:
            image = None
        async_to_sync(channel_layer.group_send)(
            room_name,
            {
                'type':'chat_message',
                'message':instance.text,
                'user': instance.author.username,
                'username':instance.author.username,
                'datetime': instance.time.isoformat(),
                'pk':instance.pk, 
                'image': image, 
                'alert_id':instance.pk, 
                'author':instance.author.pk
            }
        )
