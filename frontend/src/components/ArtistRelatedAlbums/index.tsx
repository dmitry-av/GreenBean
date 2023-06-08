import { useGetRelatedAlbumsQuery } from "../../services/albumsApi";
import { Album } from "../../models/album";
import { Link } from 'react-router-dom';
import LoadingIndicator from "../LoadingIndicator";
import genericAlbumPic from "../../assets/generic-album.jpeg";
import "./ArtistRelatedAlbums.css";


function ArtistRelatedAlbums({ disc_id }: { disc_id: string; }) {
    const { data: albums, error, isLoading, isFetching, isSuccess } = useGetRelatedAlbumsQuery(
        disc_id!,
        { refetchOnMountOrArgChange: true }
    );

    let content;

    if (isSuccess) {
        content =
            <div className="album-grid">
                {albums.map((album: Album) => (
                    <article className="album-card" key={album.disc_id}>
                        <Link to={`/albums/${album.disc_id}`}>
                            <img
                                src={album.cover_ext_url ?? genericAlbumPic}
                                alt={genericAlbumPic}
                                className="related-album-image"
                            />
                            <h3 className="related-album-title">{album.title}<span className="p-2 album-year">{album.year}</span></h3>
                        </Link>
                    </article>
                ))}
            </div>;
    }

    if (error) {
        content = <p>No albums found</p>;
    }

    return (
        <section className="albums-list">
            <h2 className="related-albums-header">Discography</h2>
            {(isLoading || isFetching) ? <LoadingIndicator /> : content}
        </section>
    );
}

export default ArtistRelatedAlbums;