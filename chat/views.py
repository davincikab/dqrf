from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required

# local code
from alerts.models import Alert, AlertImage
from .models import Message

# Create your views here.
@login_required
def room(request, alert_id):
    alert = get_object_or_404(Alert, pk=alert_id)
    alerts = Alert.objects.filter(status='NEW')
    messages = Message.objects.filter(alert=alert)[:10]
    images = AlertImage.objects.filter(alert=alert)

    if len(images) > 0:
        images = images[0]
    else:
        images = ""

    # get the chats for specific alert
    context = {
        'alerts':alerts,
        'activeAlert':alert,
        'image':images,
        'messages':messages
    }

    return render(request, 'chats/room.html', context)

# if event is resolved redirect to list of active events
# Implement pagination