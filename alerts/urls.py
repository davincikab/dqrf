from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from .views import main_view, alert_list

urlpatterns = [
    path('', main_view, name='home'),
    path('alert_list/', alert_list, name="list-alert"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)