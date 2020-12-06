from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.generic import ListView

from .models import Alert

# Create your views here.
@login_required
def main_view(request):
    return render(request, 'alerts/index.html')

@login_required
def alert_list(request):
    alerts = Alert.objects.all()

    # pagination
    return render(request, 'alerts/alerts_list.html', {'alerts':alerts})