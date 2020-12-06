from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.
@login_required
def main_view(request):
    return render(request, 'alerts/index.html')