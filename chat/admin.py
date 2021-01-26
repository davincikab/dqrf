from django.contrib import admin
from .models import Message

# Register your models here.
@admin.register(Message)
class ResponseAdmin(admin.ModelAdmin):
    list_display = ('alert', 'author', 'time',)
    search_fields = ('text',)
    list_filter = ('is_read',)