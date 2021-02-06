from django.urls import re_path, path

from . import consumers

websocket_urlpatterns = [
    path('ws/chat/alerts/<str:alert_id>', consumers.ChatConsumer.as_asgi()),
    re_path(r'ws/chat/room/(?P<alert_id>\d+)/$', consumers.ChatConsumer.as_asgi()),
]