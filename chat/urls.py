from django.urls import path
from .views import room

urlpatterns = [
    path('room/<int:alert_id>', room, name="chat-room"),
]
