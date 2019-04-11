from django.core.exceptions import ValidationError
from django.utils.translation import ugettext as _


class CustomPasswordValidator(object):

    def __init__(self, min_special_chars=1, min_num_chars=1):
        self.min_num_chars = min_num_chars
        self.min_special_chars = min_special_chars

    def validate(self, password, user=None):
        special_characters = "[~\!@#\$%\^&\*\(\)_\+{}\":;'\[\]]"
        if not any(char.isdigit() for char in password):
            raise ValidationError(
                _('Password must contain at least %(min_chars)d digit.') % {'min_chars': self.min_num_chars})
        if not any(char.isupper() for char in password) or not any(char.islower() for char in password):
            raise ValidationError('Password must use both uppercase and lowercase letters')
        if not any(char in special_characters for char in password):
            raise ValidationError(
                _('Password must contain at least %(min_chars)d special character.') % {
                    'min_chars': self.min_special_chars})
        if user.first_name in password or user.last_name in password:
            raise ValidationError(
                _('Password cannot contain first name or last name.'))

    def get_help_text(self):
        return ""
