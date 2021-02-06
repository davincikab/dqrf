
from rest_framework import generics
from rest_framework.response import Response
from django.shortcuts import render, get_object_or_404

from accounts.models import User
from alerts.models import Alert, AlertImage
from chat.models import Message

from .serializers import AlertSerializer, MessageSerializer, UserSerializer, AlertImageSerializer

# Create your views here.
class AlertListView(generics.ListCreateAPIView):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer

    def get_queryset(self):
        return Alert.objects.filter(status='NEW')


# class AlertListView(generics.CreateAPIView):
#     queryset = Alert.objects.all()
#     serializer_class = AlertSerializer

class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def retrieve(self, request, pk=None):
        user = get_object_or_404(User, username=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

class MessageListView(generics.ListCreateAPIView):
    # queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def get_queryset(self):
        alert_id = self.kwargs['alert_id']

        return Message.objects.filter(alert=alert_id)

class AlertImageListView(generics.ListCreateAPIView):
    # queryset = Message.objects.all()
    serializer_class = AlertImageSerializer

    def get_queryset(self):
        alert_id = self.kwargs['alert_id']

        return AlertImage.objects.filter(alert=alert_id)
