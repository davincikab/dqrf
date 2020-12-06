from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from .forms import LoginForm, UserRegistrationForm, UserProfileForm, UserEditForm

# Create your views here.
def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)

        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']

            user = authenticate(request, username=username, password=password)

            if user is not None:
                if user.is_active:
                    login(request, user)
                    return HttpResponse("Login Successfully")
                else:
                    return HttpResponse("Not registered")
            else:
                return HttpResponse("Invalid Login")
    else:
        form = LoginForm()
        return render(request, 'account/login.html', {'form':form})

def register(request):
    if request.method == "POST":
        form = UserRegistrationForm(request.POST)

        if form.is_valid():
            new_user = form.save(commit=False)
            cd = form.cleaned_data

            new_user.set_password(cd['password2'])
            new_user.save()
           
            return render(request, 'account/register_success.html', {'new_user':new_user})
    else:
        form = UserRegistrationForm()
        return render(request, 'account/register.html', {'form':form})

@login_required
def profile(request):
    return render(request, 'account/user_profile.html')

@login_required
def edit_user(request):
    if request.method == 'POST':
        user_edit_form = UserEditForm(instance=request.user, data=request.POST)
        user_profile_form = UserProfileForm(request.POST, request.FILES, instance=request.user.userprofile)

        if user_edit_form.is_valid() and user_profile_form.is_valid():
            print(request.FILES)
            user_edit_form.save()

            profile = user_profile_form.save(commit = False)
            profile.save()

            messages.success(request, "Updated profile successfully")
            return redirect("profile")
        else:
            messages.error(request, "Error updating your profile")
    else:
        user_edit_form = UserEditForm(instance=request.user)
        user_profile_form = UserProfileForm(instance=request.user.userprofile)
    return render(request, "account/user_edit_form.html", {'user_edit_form':user_edit_form, 'user_profile_form':user_profile_form})


    

