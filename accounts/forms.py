from django import forms
from django.contrib.auth.models import User
from .models import UserProfile


class UserRegistrationForm(forms.ModelForm):
    password = forms.CharField(label="Password", max_length=20, required=True, 
        widget=forms.PasswordInput)
    password2 = forms.CharField(label="Confirm Password", max_length=20, required=True, 
        widget=forms.PasswordInput)
    
    class Meta:
        model = User
        fields = ('username', 'first_name', 'email')

    def clean_password2(self):
        cd = self.cleaned_data

        if cd['password'] != cd['password2']:
            raise forms.ValidationError("Passwords do not match")

        return cd['password2']
    
class LoginForm(forms.Form):
    username = forms.CharField(label="Username", max_length=50, required=True)
    password = forms.CharField(label="Password", max_length=50, required=False, widget=forms.PasswordInput)


class UserEditForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ("first_name", "email", "last_name")


class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ("date_of_birth", "photo")