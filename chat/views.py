from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required

# local code
from alerts.models import Alert
from .models import Message

# Create your views here.
@login_required
def room(request, alert_id):
    alert = get_object_or_404(Alert, pk=alert_id)
    alerts = Alert.objects.filter(status='NEW')
    messages = Message.objects.filter(alert=alert)[:10]

    # get the chats for specific alert
    context = {
        'alerts':alerts,
        'activeAlert':alert,
        'messages':messages
    }

    return render(request, 'chats/room.html', context)
