import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.utils import timezone
from django.contrib.auth import get_user_model

from channels.db import database_sync_to_async
from .models import Message
from alerts.models import Alert

User = get_user_model()

class ChatConsumer(WebsocketConsumer):
    def new_message(self, message, declined=False):
        print(message)
        user = self.user

        alert_id = int(self.room_name)
        alert = self.get_alert(alert_id)

        if declined:
            alert.status = "DECLINED"
            alert.save()

        userMessage = Message.objects.create(
            text=message,
            author=user,
            alert=alert
        )

        return self.send_chat_message(message, userMessage)

    def get_alert(self, alert_id):
        return Alert.objects.get(pk=alert_id)
    
    def connect(self):
        print("Connecting")
        self.user = self.scope['user']
        self.room_name = self.scope['url_route']['kwargs']['alert_id']

        print(self.room_name)
        self.room_group_name = 'chat_%s' % self.room_name
        print(self.room_group_name)

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        print("message recieved")
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        declined = text_data_json['declined'] or False

        self.new_message(message, declined)
        

    def send_chat_message(self, message, alertMessage):
        now = timezone.now()

        try:
            image = alertMessage.image.url
        except ValueError:
            image = None

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type':'chat_message',
                'message':message,
                'user': self.user.username,
                'datetime': alertMessage.time.isoformat(),
                'pk':alertMessage.pk, 
                'image':image, 
                'alert_id':alertMessage.pk, 
                'author':alertMessage.author
            }
        )

    def chat_message(self, event):
        print(event)
        message = event['message']

        self.send(text_data=json.dumps(event))
    
    def send_alert_message(self, event):
        print("event triggered")
        print(event)
        self.send(text_data=json.dumps(event))
