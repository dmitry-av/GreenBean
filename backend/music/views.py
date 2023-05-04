from rest_framework.decorators import action
from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.authentication import TokenAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from urllib.parse import unquote

from django.contrib.auth.models import User

from music.permissions import IsCreatorPermission, IsAdminUserOrReadOnly
from rest_framework.response import Response


from music.discogs import fill_album_details, album_search_and_save, fill_artist_details, artist_search_and_save
from music.serializers import (AlbumSerializer, AlbumDetailSerializer,
                               GenreSerializer, SearchSerializer,
                               ReviewSerializer, ReviewDetailSerializer,
                               ArtistSerializer, ArtistDetailSerializer)
from music.models import Genre, Album, Review, Artist


class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    permission_classes = [IsAdminUserOrReadOnly]
    lookup_field = 'disc_id'

    def get_serializer_class(self):
        if self.action in ["list"]:
            return AlbumSerializer
        return AlbumDetailSerializer

    def get_object(self):
        album = super().get_object()
        fill_album_details(album)
        return album

    @action(methods=["get"], detail=False)
    def search(self, request):
        search_serializer = SearchSerializer(data=request.GET)

        if not search_serializer.is_valid():
            return Response(search_serializer.errors)

        term = unquote(search_serializer.data["term"])

        album_search_and_save(term)

        albums = self.get_queryset().filter(title__icontains=term)

        page = self.paginate_queryset(albums)

        if page is not None:
            serializer = AlbumSerializer(
                page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        return Response(
            AlbumSerializer(albums, many=True, context={
                            "request": request}).data
        )


class ArtistViewSet(viewsets.ModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    permission_classes = [IsAdminUserOrReadOnly]
    lookup_field = 'disc_id'

    def get_serializer_class(self):
        if self.action in ["list", "create"]:
            return ArtistSerializer
        return ArtistDetailSerializer

    def get_object(self):
        artist = super().get_object()
        fill_artist_details(artist)
        return artist

    @action(methods=["get"], detail=False)
    def search(self, request):
        search_serializer = SearchSerializer(data=request.GET)

        if not search_serializer.is_valid():
            return Response(search_serializer.errors)

        term = search_serializer.data["term"]

        artist_search_and_save(term)

        artists = self.get_queryset().filter(name__icontains=term)

        page = self.paginate_queryset(artists)

        if page is not None:
            serializer = ArtistSerializer(
                page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        return Response(
            ArtistSerializer(artists, many=True, context={
                "request": request}).data
        )


class ReviewViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated | IsCreatorPermission]
    serializer_class = ReviewSerializer
    queryset = Review.objects.all()

    def get_serializer_class(self):
        if self.action in ["list", "create"]:
            return ReviewSerializer
        return ReviewDetailSerializer

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    def create(self, request, *args, **kwargs):
        album_id = request.data.get('album')
        if Review.objects.filter(album_id=album_id, creator=request.user).exists():
            raise PermissionDenied('You have already reviewed this album.')
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        review = self.get_object()
        if review.creator != request.user:
            raise PermissionDenied(
                "You don't have permission to delete this review.")
        super().destroy(request, *args, **kwargs)
        return Response({"message": "Review deleted successfully"}, status=status.HTTP_200_OK)
