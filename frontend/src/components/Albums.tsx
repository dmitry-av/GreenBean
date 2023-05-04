import { useEffect, useState } from 'react';
import AlbumList from './AlbumList';
import NewAlbum from './NewAlbum';
import { Album } from '../models/album';
import musicService from '../services/music';


function Albums() {
    const [albums, setAlbums] = useState<Album[]>([]);

    useEffect(() => {
        loadAlbums();
    }, []);

    const loadAlbums = async () => {
        const albums = await musicService.getAlbums(1);
        setAlbums(albums);
    };

    const removeAlbum = (disc_id: string) => {
        setAlbums(albums.filter(album => album.disc_id !== disc_id));
    };

    const addAlbum = async (title: string) => {
        const newAlbum = await musicService.addAlbum(title);
        setAlbums([newAlbum, ...albums]);
    };

    return (
        <div>
            <NewAlbum onAddAlbum={addAlbum} />
            <AlbumList items={albums} onRemoveAlbum={removeAlbum} />
        </div>
    );
}

export default Albums;