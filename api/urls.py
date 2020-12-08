from django.urls import path

# local
from .views import AlertListView

urlpatterns = [
    path('', AlertListView.as_view()),
]
