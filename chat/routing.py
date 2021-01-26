from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/room/(?P<alert_id>\d+)/$', consumers.ChatConsumer.as_asgi()),
    re_path(r'ws/chat/alerts/', consumers.ChatConsumer.as_asgi()),
]