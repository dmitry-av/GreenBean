from django.contrib import admin
from music.models import Album, Genre, SearchTerm, Track, Artist

admin.site.register(Album)
admin.site.register(Genre)
admin.site.register(SearchTerm)
admin.site.register(Track)
admin.site.register(Artist)
