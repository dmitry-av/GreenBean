import { useGetRelatedAlbumsQuery } from "../../services/albumsApi";
import { Album } from "../../models/album";
import { Link } from 'react-router-dom';
import LoadingIndicator from "../LoadingIndicator";


function ArtistRelatedAlbums({ disc_id }: { disc_id: string; }) {
    const { data: albums, error, isLoading, isFetching, isSuccess } = useGetRelatedAlbumsQuery(
        disc_id!,
        { refetchOnMountOrArgChange: true }
    );

    let content;

    if (isSuccess) {
        content = albums.map((album: Album) => (
            <article className="post-excerpt" key={album.disc_id}>
                <h3>
                    <Link to={`/albums/${album.disc_id}`}>
                        {album.title} - {album.year}
                    </Link>
                </h3>
            </article>
        ));
    }

    if (error) {
        content = <p>No albums found</p>;
    }

    return (
        <section className="albums-list">
            <h2>Albums</h2>
            {(isLoading || isFetching) ? <LoadingIndicator /> : content}
        </section>
    );
}

export default ArtistRelatedAlbums;