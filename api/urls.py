from django.urls import path

# local
from .views import AlertListView, MessageListView, UserDetailView, AlertImageListView

urlpatterns = [
    path('', AlertListView.as_view()),
    path('users/<str:pk>/', UserDetailView.as_view()),
    path('messages/<int:alert_id>/', MessageListView.as_view()),
    path('alert_image/<int:alert_id>/', AlertImageListView.as_view()),
]
