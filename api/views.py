
from rest_framework import generics
from django.shortcuts import render


from alerts.models import Alert
from .serializers import AlertSerializer

# Create your views here.
class AlertListView(generics.ListAPIView):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer