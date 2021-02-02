from django.urls import path

# local
from .views import AlertListView, MessageListView, UserDetailView

urlpatterns = [
    path('', AlertListView.as_view()),
    path('users/<str:pk>/', UserDetailView.as_view()),
    path('messages/<int:alert_id>/', MessageListView.as_view()),
]
