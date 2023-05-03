import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../store";
import { fetchAlbums } from '../store/slices/albumsSlice';
import { Album } from '../models/album';
import { selectAllAlbums, selectAlbumById } from '../store/slices/albumsSlice';
import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';

export const AlbumsList = () => {
    const dispatch = useAppDispatch();
    const albums = useSelector(selectAllAlbums);
    const albumStatus = useSelector((state: RootState) => state.albums.status);

    useEffect(() => {
        if (albumStatus === 'idle') {
            dispatch(fetchAlbums());
        }
    }, [albumStatus, dispatch]);

    const renderedAlbums = albums.map((album: Album) => (
        <article className="post-excerpt" key={album.disc_id}>
            <h3>{album.title} - {album.year}</h3>
        </article>
    ));


    return (
        <section className="posts-list">
            <h2>Albums</h2>
            {renderedAlbums}
        </section>
    );
};