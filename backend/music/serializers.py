from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from green_auth.serializers import UserSerializer
from music.models import Genre, Album, Track, Artist, Review


class GenreField(serializers.SlugRelatedField):
    def to_internal_value(self, data):
        try:
            return self.get_queryset().get_or_create(name=data)[0]
        except (TypeError, ValueError):
            self.fail(f"Tag value {data} is invalid")


class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = ('disc_id', 'name',)


class ArtistDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Artist
        fields = "__all__"
        lookup_field = 'disc_id'


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = "__all__"


class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ('position', 'title', 'duration')


class ReviewSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    disc_id = serializers.ReadOnlyField(source='album.disc_id')
    album_title = serializers.ReadOnlyField(source='album.title')

    class Meta:
        model = Review
        fields = ["id", "creator", "album", "disc_id",
                  "album_title", "rating", "modified_at", "created_at"]
        read_only_fields = ["modified_at", "created_at"]


class AlbumSerializer(serializers.ModelSerializer):
    avg_rating = serializers.ReadOnlyField(source='get_avg_rating')

    class Meta:
        model = Album
        fields = ('disc_id', 'title', 'year',
                  'avg_rating', 'reviews', 'is_full_record')
        read_only_fields = [
            "title",
            "year",
            "disc_id",
            "get_avg_rating",
            "is_full_record"
        ]


class ReviewDetailSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    album = AlbumSerializer()

    class Meta:
        model = Review
        fields = "__all__"
        read_only_fields = ("created_at", "modified_at", "album")


class AlbumDetailSerializer(serializers.ModelSerializer):
    genres = GenreField(slug_field="name", many=True, read_only=True)
    avg_rating = serializers.ReadOnlyField(source='get_avg_rating')
    artists = ArtistSerializer(many=True)
    tracks = TrackSerializer(many=True)
    reviews = ReviewSerializer(many=True)
    lookup_field = 'disc_id'

    class Meta:
        model = Album
        fields = "__all__"
        read_only_fields = [
            "title",
            "year",
            "disc_id",
            "genres",
            "cover",
            "get_avg_rating",
            "is_full_record"
        ]


class AlbumTitleAndUrlSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedRelatedField("album-detail", read_only=True)

    class Meta:
        model = Album
        fields = ["title", "url"]


class SearchSerializer(serializers.Serializer):
    term = serializers.CharField()