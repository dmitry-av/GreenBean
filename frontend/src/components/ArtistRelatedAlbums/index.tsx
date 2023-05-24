import { useGetRelatedAlbumsQuery } from "../../services/albumsApi";
import { Album } from "../../models/album";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';


function ArtistRelatedAlbums({ disc_id }: { disc_id: string; }) {
    const { data: albums, error, isLoading, isSuccess } = useGetRelatedAlbumsQuery(disc_id!, { refetchOnMountOrArgChange: true });
    let content;
    if (isLoading) {
        content = <div>Loading...</div>;
    }

    if (error) {
        if ('status' in error) {
            content = 'error' in error ? error.error : JSON.stringify(error.data);

            toast.error(content);
        }
        else {
            content = error.message;
            toast.error(error.message);
        }
    }

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


    return (
        <section className="albums-list">
            <h2>Albums</h2>
            {content}
        </section>
    );
};


export default ArtistRelatedAlbums;