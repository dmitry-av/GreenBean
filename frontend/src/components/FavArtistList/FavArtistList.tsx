import { useGetFavoriteArtistsQuery } from "../../services/albumsApi";
import { Artist } from "../../models/album";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';


function FavArtistList() {
    const { data: artists, error, isLoading, isSuccess } = useGetFavoriteArtistsQuery();
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
        content = artists.map((artist: Artist) => (
            <article className="post-excerpt" key={artist.disc_id}>
                <h3>
                    <Link to={`/artists/${artist.disc_id}`}>
                        {artist.name}
                    </Link>
                </h3>
            </article>
        ));
    }


    return (
        <section className="artists-list">
            <h2>Artists</h2>
            {content}
        </section>
    );
};

export default FavArtistList;