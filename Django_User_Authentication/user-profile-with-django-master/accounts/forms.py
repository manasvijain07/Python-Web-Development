from django import forms
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.forms import UserCreationForm

from .models import User, Profile


class SignUpForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, required=False)
    last_name = forms.CharField(max_length=30, required=False)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'password1', 'password2')


class UserForm(forms.ModelForm):
    confirm_email = forms.EmailField(max_length=254)

    def __init__(self, *args, **kwargs):
        super(UserForm, self).__init__(*args, **kwargs)
        self.initial['confirm_email'] = self.initial['email']

    def clean_confirm_email(self):
        """
        Validate that the validate_email field is the same as the email field.
        """
        first_email_field = self.cleaned_data["email"]
        second_email_field = self.cleaned_data["confirm_email"]

        if first_email_field != second_email_field:
            raise forms.ValidationError("Email fields don't match", code='invalid')
        return second_email_field

    class Meta:
        model = User
        fields = ('username', 'email', 'confirm_email', 'first_name', 'last_name')


class ProfileForm(forms.ModelForm):
    birth_date = forms.CharField(
        widget=forms.TextInput(
            attrs={'data-format': 'YYYY-MM-DD',
                   'data-template': 'D MMM YYYY',
                   'value': '1990-01-01',
                   }))

    class Meta:
        model = Profile
        fields = ('birth_date', 'bio', 'city', 'state', 'hobby', 'fav_animal', 'avatar')


class PasswordChangeCustomForm(PasswordChangeForm):
    def clean_new_password1(self):
        """
        Validate that the new_password field is not the same as the old_password field.
        """
        old_password = self.cleaned_data["old_password"]
        new_password = self.cleaned_data["new_password1"]

        if new_password == old_password:
            raise forms.ValidationError('Password cannot be the same as the previous password.', code='invalid')
        return new_password
