from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.authentication import TokenAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from urllib.parse import unquote
from django.db.models import Q

from django.contrib.auth.models import User

from music.permissions import IsCreatorPermission, IsAdminUserOrReadOnly
from rest_framework.response import Response


from music.discogs import fill_album_details, album_search_and_save, fill_artist_details, artist_search_and_save, find_artist_albums
from music.serializers import (AlbumSerializer, AlbumDetailSerializer,
                               GenreSerializer, SearchSerializer,
                               ReviewSerializer, ReviewDetailSerializer,
                               ArtistSerializer, ArtistDetailSerializer)
from music.models import Genre, Album, Review, Artist


class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    # permission_classes = [IsAdminUserOrReadOnly]
    lookup_field = 'disc_id'

    def get_permissions(self):
        if self.action in ["favorite", "del_favorite"]:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUserOrReadOnly]
        return [permission() for permission in permission_classes]

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

        album_search_and_save(term.lower())

        albums = self.get_queryset().filter(Q(title__icontains=term)
                                            | Q(artists__name__icontains=term)).order_by('full_title')

        page = self.paginate_queryset(albums)

        if page is not None:
            serializer = AlbumSerializer(
                page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        return Response(
            AlbumSerializer(albums, many=True, context={
                            "request": request}).data
        )

    @action(methods=["get"], detail=False, url_path="random")
    def random(self, request):
        random_list = Album.objects.order_by('?')
        page = self.paginate_queryset(random_list)
        if page is not None:
            serializer = AlbumSerializer(
                page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)
        return Response(
            AlbumSerializer(random_list, many=True, context={
                "request": request}).data
        )

    @action(methods=["post"], detail=False, url_path="favorite")
    def favorite(self, request):
        album = get_object_or_404(Album, disc_id=request.data.get('disc_id'))
        if request.user not in album.favorite.all():
            album.favorite.add(request.user)
            return Response({'success': 'User added to album'}, status=status.HTTP_200_OK)
        return Response({'error': 'Album is already in favorites'}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["delete"], detail=False, url_path="delete-favorite")
    def del_favorite(self, request):
        album = get_object_or_404(Album,  disc_id=request.data.get('disc_id'))
        if request.user in album.favorite.all():
            album.favorite.remove(request.user)
            return Response({'success': 'Removed from favorites'}, status=status.HTTP_204_NO_CONTENT)
        return Response({'error': "Album is not in favorites"}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["get"], detail=False, url_path="favorites")
    def get_favorites(self, request):
        if request.user.is_authenticated:
            favorite_albums = Album.objects.filter(favorite=request.user)
            serializer = AlbumDetailSerializer(
                favorite_albums, many=True, context={"request": request})
            return Response(serializer.data)
        return Response({'access': "Need to be authenticated"}, status=status.HTTP_401_UNAUTHORIZED)


class ArtistViewSet(viewsets.ModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    # permission_classes = [IsAdminUserOrReadOnly]
    lookup_field = 'disc_id'

    def get_permissions(self):
        if self.action in ["favorite", "del_favorite"]:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUserOrReadOnly]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action in ["list", "create"]:
            return ArtistSerializer
        return ArtistDetailSerializer

    def get_object(self):
        artist = super().get_object()
        fill_artist_details(artist)
        find_artist_albums(artist)
        return artist

    @action(methods=["get"], detail=False)
    def search(self, request):
        search_serializer = SearchSerializer(data=request.GET)

        if not search_serializer.is_valid():
            return Response(search_serializer.errors)

        term = search_serializer.data["term"]

        artist_search_and_save(term.lower())

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

    @action(methods=["post"], detail=False, url_path="favorite", permission_classes=[IsAuthenticated])
    def favorite(self, request):
        artist = get_object_or_404(Artist, disc_id=request.data.get('disc_id'))
        if request.user not in artist.favorite.all():
            artist.favorite.add(request.user)
            return Response({'success': 'User added to artist'}, status=status.HTTP_200_OK)
        return Response({'error': 'Artist is already in favorites'}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["delete"], detail=False, url_path="delete-favorite")
    def del_favorite(self, request):
        artist = get_object_or_404(
            Artist,  disc_id=request.data.get('disc_id'))
        if request.user in artist.favorite.all():
            artist.favorite.remove(request.user)
            return Response({'success': 'Removed from favorites'}, status=status.HTTP_204_NO_CONTENT)
        return Response({'error': "Artist is not in favorites"}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["get"], detail=False, url_path="favorites")
    def get_favorites(self, request):
        if request.user.is_authenticated:
            favorite_artists = Artist.objects.filter(favorite=request.user)
            serializer = ArtistDetailSerializer(
                favorite_artists, many=True, context={"request": request})
            return Response(serializer.data)
        return Response({'access': "Need to be authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

    @action(methods=["get"], detail=True, url_path="related-albums")
    def related_albums(self, request, disc_id=None):
        try:
            artist = self.get_object()
        except Artist.DoesNotExist:
            return Response(status=404)

        # Get the albums associated with the artist
        albums = artist.albums.select_related().all().order_by("-year")

        # Use your AlbumSerializer to serialize the albums
        serializer = AlbumSerializer(albums, many=True)
        return Response(serializer.data)


class ReviewViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly, IsCreatorPermission]
    serializer_class = ReviewSerializer
    queryset = Review.objects.all()

    def get_serializer_class(self):
        if self.action in ["list", "create", "update"]:
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
