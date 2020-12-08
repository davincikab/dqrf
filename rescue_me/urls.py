from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('alerts.urls')),
    path('accounts/', include('account.urls')),
    path('api/v1/', include('api.urls'))
]
