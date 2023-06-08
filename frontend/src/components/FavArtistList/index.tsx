import { useGetFavoriteArtistsQuery } from "../../services/albumsApi";
import { Artist } from "../../models/album";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import genericArtistPic from "../../assets/generic-artist.png";
import "./FavArtistList.css";


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
            <article className="artist-search-card" key={artist.disc_id}>
                <Link to={`/artists/${artist.disc_id}`} className="album-link">
                    <div className="artist-result-content">
                        <div className="artist-image-container">
                            <img
                                src={(artist.cover || artist.cover_ext_url) ?? genericArtistPic}
                                alt={genericArtistPic}
                                className="artist-image"
                            />
                        </div>
                        <div className="artist-details">
                            <span className="artist-title">{artist.name}</span>
                        </div>
                    </div>
                </Link>
            </article>
        ));
    }


    return (
        <section className="favorite-artists-list">
            <h2 className="favorite-artists-header">Favorite artists</h2>
            {content}
        </section>
    );
};

export default FavArtistList;