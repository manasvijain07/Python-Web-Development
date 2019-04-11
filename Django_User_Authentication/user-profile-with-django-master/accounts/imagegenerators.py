from imagekit import ImageSpec, register
from imagekit.processors import ResizeToFill


class Thumbnail(ImageSpec):
    processors = [ResizeToFill(100, 50)]
    format = 'JPEG'
    options = {'quality': 60}


class ProfilePic(ImageSpec):
    processors = [ResizeToFill(300, 300)]
    format = 'JPEG'
    options = {'quality': 60}


register.generator('accounts:thumbnail', Thumbnail)
register.generator('accounts:profile_pic', ProfilePic)
