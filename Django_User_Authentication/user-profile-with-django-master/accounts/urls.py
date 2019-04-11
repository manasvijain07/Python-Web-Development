from django.urls import path

from . import views

urlpatterns = [
    path('sign_in/', views.sign_in, name='sign_in'),
    path('sign_up/', views.sign_up, name='sign_up'),
    path('sign_out/', views.sign_out, name='sign_out'),
    path('profile/change_password/<str:username>', views.change_password, name='change_password'),
    path('profile/edit/<str:username>', views.edit_profile, name='edit_profile'),
    path('profile/<str:username>', views.view_profile, name='profile'),
]
