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
    favorites = serializers.ReadOnlyField(source='get_favorites')

    class Meta:
        model = Artist
        fields = ('disc_id', 'name', 'cover_ext_url', 'favorites')


class ArtistDetailSerializer(serializers.ModelSerializer):
    favorites = serializers.ReadOnlyField(source='get_favorites')
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Artist
        fields = "__all__"
        lookup_field = 'disc_id'

    def get_is_favorite(self, artist):
        user = self.context['request'].user
        return artist.favorite.filter(id=user.id).exists()


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
                  "album_title", "rating", "modified_at", "created_at", "text"]
        read_only_fields = ["modified_at", "created_at"]


class AlbumSerializer(serializers.ModelSerializer):
    avg_rating = serializers.ReadOnlyField(source='get_avg_rating')
    favorites = serializers.ReadOnlyField(source='get_favorites')
    artists = ArtistSerializer(many=True)

    class Meta:
        model = Album
        fields = ('disc_id', 'title', 'full_title', 'artists', 'year', 'cover',
                  'avg_rating', 'reviews', 'cover_ext_url', 'is_full_record', 'favorites')
        read_only_fields = [
            "title",
            "year",
            "disc_id",
            "get_avg_rating",
            "is_full_record"
        ]


class AlbumDetailSerializer(serializers.ModelSerializer):
    genres = GenreField(slug_field="name", many=True, read_only=True)
    avg_rating = serializers.ReadOnlyField(source='get_avg_rating')
    favorites = serializers.ReadOnlyField(source='get_favorites')
    artists = ArtistSerializer(many=True)
    tracks = TrackSerializer(many=True)
    reviews = ReviewSerializer(many=True)
    lookup_field = 'disc_id'
    is_favorite = serializers.SerializerMethodField()

    def get_is_favorite(self, album):
        user = self.context['request'].user
        return album.favorite.filter(id=user.id).exists()

    class Meta:
        model = Album
        exclude = ('favorite', )
        read_only_fields = [
            "title",
            "year",
            "disc_id",
            "genres",
            "cover",
            "get_avg_rating",
            "is_full_record"
        ]


class ReviewDetailSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    album = AlbumDetailSerializer()

    class Meta:
        model = Review
        fields = "__all__"
        read_only_fields = ("created_at", "modified_at", "album")


class AlbumTitleAndUrlSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedRelatedField("album-detail", read_only=True)

    class Meta:
        model = Album
        fields = ["title", "url"]


class SearchSerializer(serializers.Serializer):
    term = serializers.CharField()
