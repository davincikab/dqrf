from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required

# local code
from alerts.models import Alert

# Create your views here.
@login_required
def room(request, alert_id):
    alert = get_object_or_404(Alert, pk=alert_id)
    alerts = Alert.objects.all()

    # get the chats for specific alert
    context = {
        'alerts':alerts,
        'alert':alert
    }

    return render(request, 'chats/room.html', context)
