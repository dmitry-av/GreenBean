import datetime

from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import Avg


UserModel = get_user_model()


class Genre(models.Model):
    class Meta:
        ordering = ["name"]

    name = models.TextField(unique=True)

    def __str__(self):
        return self.name


class Artist(models.Model):
    name = models.CharField(max_length=64)
    disc_id = models.SlugField(max_length=255, unique=True)  # unique field
    cover = models.ImageField(upload_to='band_covers', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    is_full_record = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name}"

    class Meta:
        ordering = ["name"]


class Album(models.Model):
    class Meta:
        ordering = ["title", "year"]

    title = models.CharField(max_length=64)
    year = models.PositiveIntegerField()
    artists = models.ManyToManyField(Artist, related_name="albums")
    disc_id = models.SlugField(max_length=255, unique=True)  # unique field
    genres = models.ManyToManyField(Genre, related_name="albums")
    cover = models.ImageField(upload_to='covers', blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    is_full_record = models.BooleanField(default=False)

    @property
    def get_avg_rating(self):
        if self.reviews.all().exists():
            avg_rating = self.reviews.filter(
                rating__isnull=False).aggregate(Avg('rating'))['rating__avg']
            return "{0:.2f}".format(avg_rating)
        return None

    def __str__(self):
        artists_str = ', '.join(str(artist) for artist in self.artists.all())
        return f"{self.title} ({self.year}) - {artists_str}"


class Track(models.Model):
    title = models.CharField(max_length=64)
    position = models.PositiveSmallIntegerField()
    duration = models.CharField(max_length=12)
    album = models.ForeignKey(
        Album, on_delete=models.CASCADE, related_name="tracks")

    def __str__(self):
        return f"{self.title} - {self.album}"


class SearchTerm(models.Model):
    term = models.TextField(unique=True)
    MODEL_CHOICES = (('album', 'album'),
                     ('artist', 'artist'),
                     ('track', 'track'))
    model = models.CharField(choices=MODEL_CHOICES, max_length=24)
    last_search = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('term', 'model',)

    def __str__(self):
        return self.term


class Review(models.Model):
    creator = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    album = models.ForeignKey(
        Album, on_delete=models.CASCADE, related_name="reviews")
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    text = models.TextField()
    RAITING_CHOICES = (
        (1, "1"),
        (2, "2"),
        (3, "3"),
        (4, "4"),
        (5, "5"),
        (6, "6"),
        (7, "7"),
        (8, "8"),
        (9, "9"),
        (10, "10"),
    )

    rating = models.IntegerField(
        choices=RAITING_CHOICES)

    def __str__(self):
        if self.creator:
            return f"{self.album} - {self.creator.first_name} "
        return f"{self.album}"