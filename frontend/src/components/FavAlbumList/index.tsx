import { useGetFavoriteAlbumsQuery } from "../../services/albumsApi";
import { Album } from "../../models/album";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import searchLoader from '../../assets/loader.gif';
import genericAlbumPic from "../../assets/generic-album.jpeg";
import "./FavAlbumList.css";


function FavAlbumList() {
    const { data: albums, error, isLoading, isFetching, isSuccess } = useGetFavoriteAlbumsQuery();
    let content;

    if (isLoading || isFetching) {
        return <img
            src={searchLoader}
            alt="search-loader"
            height="75"
        />;
    }

    if (error) {
        if ('status' in error) {
            content = 'error' in error ? error.error : JSON.stringify(error.data);
            toast.error(content);
        } else {
            content = error.message;
            toast.error(error.message);
        }
    }

    if (isSuccess) {
        content = (
            <div className="album-grid">
                {albums.map((album: Album) => (
                    <article className="album-card" key={album.disc_id}>
                        <Link to={`/albums/${album.disc_id}`}>
                            <img
                                src={(album.cover || album.cover_ext_url) ?? genericAlbumPic}
                                alt={genericAlbumPic}
                                width="95"
                                height="95"
                                className="album-image"
                            />
                            <h3 className="album-title">{album.title}<span className="p-2 album-year">{album.year}</span></h3>

                        </Link>
                    </article>
                ))}
            </div>
        );
    }

    return (
        <section className="albums-list">
            <h2>Albums</h2>
            {content}
        </section>
    );
}

export default FavAlbumList;