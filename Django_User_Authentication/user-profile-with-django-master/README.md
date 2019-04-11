# User Profile with Django

This is the seventh project in Treehouse Python tech degree.

Will be hosted on Heroku upon completion. To view locally clone the repo, download the requirements with pip install 
requirements.txt and run python manage.py runserver.

## Description

A sample profile and authentication site that takes in details about a registered user and displays those details on a 
profile page. The profile page is only visible once the user has logged in.

Uses Django FBVs instead of CBVs for additional practice.

## User Stories

- As a user I can create an account using my first name, last name, username, and password.
- As a user I can add additional profile details to my created account such as email, bio, birthday, city, state, 
favorite animal, and hobby.
- As a user I can add and edit a profile picture. Editing includes rotate, crop and flip functionality.
- As a user I can see the strength of a password I am creating using a password strength meter.
- As a user I can change my password at any time on the change password page.

## Completed Development Tasks

- Set up validation for email, date of birth and the biography.
- JavaScript is utilized for a date dropdown for the Date of Birth validation feature.
- JavaScript is utilized for text formatting for the Bio validation feature.
- New password passes following validation checks:
    - Must not be the same as the current password
    - Minimum password length of 14 characters.
    - Must use of both uppercase and lowercase letters
    - Must include of one or more numerical digits
    - Must include of special characters, such as @, #, $
    - Cannot contain the username or parts of the user’s full name, such as his first name