from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.generic import ListView
from django.views.decorators.http import require_POST
from django.db.models import Q
from django.http import JsonResponse

from .models import Alert, Response
from .forms import ResponseForm

# Create your views here.
@login_required
def main_view(request):
    return render(request, 'alerts/index.html')

@login_required
def alert_list(request):
    if request.GET.get('q'):
        query = request.GET.get('q')
        alerts = Alert.objects.filter(Q(description__icontains=query) | Q(emergency_type__icontains=query))
    else:
        alerts = Alert.objects.all()

    # pagination
    return render(request, 'alerts/alerts_list.html', {'alerts':alerts})

@require_POST
@login_required
def alert_response(request):
    form = ResponseForm(request.POST)
    alert = Alert.objects.get(pk = request.POST.get('id'))

    if form.is_valid():
        response = form.save(commit=False)
        response.responded_by = request.user
        response.responded_to = alert.reported_by

        return JsonResponse({'message':'success', 'status':'OK'})
    else:
        return JsonResponse({'message':'error', 'status':'ERR'})