import { useGetRelatedAlbumsQuery } from "../../services/albumsApi";
import { Album } from "../../models/album";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';


function ArtistRelatedAlbums({ disc_id }: { disc_id: string; }) {
    const { data: albums, error, isLoading, isFetching, isSuccess } = useGetRelatedAlbumsQuery(
        disc_id!,
        { refetchOnMountOrArgChange: true }
    );

    if (error) {
        if ('status' in error) {
            const content = 'error' in error ? error.error : JSON.stringify(error.data);
            toast.error(content);
        } else {
            toast.error(error.message);
        }
    }

    if (isSuccess) {
        const content = albums.map((album: Album) => (
            <article className="post-excerpt" key={album.disc_id}>
                <h3>
                    <Link to={`/albums/${album.disc_id}`}>
                        {album.title} - {album.year}
                    </Link>
                </h3>
            </article>
        ));

        return (
            <section className="albums-list">
                <h2>Albums</h2>
                {content}
            </section>
        );
    }

    return (
        <section className="albums-list">
            <h2>Albums</h2>
            {isFetching ? <div>Loading...</div> : <div>No albums found.</div>}
        </section>
    );
}

export default ArtistRelatedAlbums;
