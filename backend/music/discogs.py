import datetime
import os
import logging
import requests
import re
from datetime import timedelta
from django.utils import timezone
from tempfile import NamedTemporaryFile

import discogs_client
from discogs_client.exceptions import HTTPError, AuthorizationError

from music.models import Genre, Album, Artist, Track, SearchTerm


logger = logging.getLogger(__name__)


def get_client():
    try:
        dclient = discogs_client.Client(
            'ExampleApplication/0.1', user_token=os.environ.get("DISCOGS_KEY"))
        return dclient
    except AuthorizationError as e:
        # Log error message for debugging purposes
        logger.error(f"Discogs authorization error: {str(e)}")
        return None


def save_image(url, obj):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}
    response = requests.get(
        url, headers=headers)
    if response.status_code == 200:
        img_temp = NamedTemporaryFile(delete=True)
        img_temp.write(response.content)
        img_temp.flush()
        obj.cover.save(f"cover_{obj.disc_id}.jpg", img_temp)
        return


def term_new(search, model):
    # lowercase the search, replace multiple spaces
    normalized = re.sub(r"\s+", " ", search.lower())
    search_term, created = SearchTerm.objects.get_or_create(
        term=normalized, model=model)
    if not created and (search_term.last_search > timezone.now() - timedelta(days=1)):
        logger.warning(
            f"Search for '{normalized}' was performed in the past 24 hours so not searching again."
        )
        return False
    return True


def get_or_create_record(names, model):
    for name in names:
        record, created = model.objects.get_or_create(name=name)
        yield record


# fetches full details of film from OMDb, save to the DB, if the movie already has a full record does nothing
def fill_album_details(album):
    if album.is_full_record:
        logger.warning(
            f"{album.title} is full record."
        )
        return
    dclient = get_client()
    album_details = dclient.master(album.disc_id)
    album.title = album_details.title
    album.year = int(album_details.year)
    save_image(album_details.images[0]['uri'], album)
    album.artists.clear()
    for artist in album_details.fetch('artists'):
        record, created = Artist.objects.get_or_create(
            disc_id=artist['id'], name=artist['name'])
        album.artists.add(record)
    album.genres.clear()
    for genre in get_or_create_record(album_details.genres, Genre):
        album.genres.add(genre)
    album.tracks.all().delete()
    for no, track in enumerate(album_details.tracklist, start=1):
        record, created = Track.objects.get_or_create(
            title=track.title, album=album, position=no)
        record.duration = track.duration
        record.save()
    album.notes = album_details.fetch('notes')
    album.cover_ext_url = album_details.images[0]['uri']
    album.is_full_record = True
    album.save()


# performes a search for search_term against the API if it has not been searched in the past 1 day. Save each result to the database as a partial record.
def album_search_and_save(search):

    if term_new(search, 'album'):

        dclient = get_client()
        counter = 0
        try:
            for result in dclient.search(search, type='master'):
                logger.info(
                    f"Saving album: '{result.title}' / '{result.id}'")
                album, created = Album.objects.get_or_create(
                    disc_id=result.id,
                    defaults={
                        "title": result.title,
                        "full_title": result.title,
                        "year": int(result.year),
                    },
                )
                if result.images[0]['uri']:
                    album.cover_ext_url = result.images[0]['uri']
                album.save()
                if created:
                    logger.info(f"Album created: '{album.title}'")
                counter += 1
                if counter >= 8:
                    break
        except:
            return
        else:
            search_term = SearchTerm.objects.get(term=search, model='album')
            search_term.save()


def artist_search_and_save(search):

    if term_new(search, 'artist'):

        dclient = get_client()
        counter = 0
        for artist in dclient.search(search,
                                     title=search, type='artist'):
            logger.info(
                f"Saving album: '{artist.name}' / '{artist.id}'")
            artist, created = Artist.objects.get_or_create(
                disc_id=artist.id, name=artist.name, cover_ext_url=artist.images[0]['uri'])

            if created:
                logger.info(f"Artist created: '{artist.name}'")
            counter += 1
            if counter >= 8:
                break

        search_term = SearchTerm.objects.get(term=search, model='artist')
        search_term.save()


def fill_artist_details(artist):
    if artist.is_full_record:
        logger.warning(
            f"{artist.name} is full record."
        )
        return
    dclient = get_client()
    details = dclient.artist(artist.disc_id)
    artist.name = details.name
    try:
        save_image(details.images[0]['uri'], artist)
    except:
        artist.cover = None
    artist.description = details.profile
    artist.cover_ext_url = details.images[0]['uri']
    artist.is_full_record = True
    artist.save()


def find_artist_albums(artist):
    dclient = get_client()
    last_modified_threshold = timezone.now() - datetime.timedelta(days=21)

    # Check if the last_modified date is 21 days ago or earlier
    if artist.last_modified is None or artist.last_modified <= last_modified_threshold or not artist.albums_found:
        try:
            for result in dclient.search(artist=artist.name, type='master', format="album"):
                logger.info(f"Saving album: '{result.title}' / '{result.id}'")
                album, created = Album.objects.get_or_create(
                    disc_id=result.id,
                    defaults={
                        "title": result.title,
                        "full_title": result.title,
                        "year": int(result.year)
                    },
                )
                if created:
                    if result.images[0]['uri']:
                        album.cover_ext_url = result.images[0]['uri']
                    list_names = [artist['name']
                                  for artist in result.fetch('artists')]
                    if artist.name in list_names:
                        album.artists.add(artist)
                if created:
                    logger.warning(f"Album created: '{album.title}'")

        except Exception as e:
            logger.error(f"Error occurred during search: {str(e)}")
            artist.albums_found = False
            # Handle the error here (e.g., log it or perform error-specific actions)
            return

        else:
            artist.albums_found = True
            artist.save()
