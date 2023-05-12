import { Link, useParams } from 'react-router-dom';
import { useGetAlbumDetailQuery } from '../services/albumsApi';
import { toast } from 'react-toastify';
import NewReview from './NewReview';
import { useSelector } from "react-redux";
import { RootState } from "../store";


export const AlbumDetailPage = () => {
    const { disc_id } = useParams();
    const { data, error, isLoading } = useGetAlbumDetailQuery(disc_id!);
    const auth = useSelector((state: RootState) => state.auth);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        if ('status' in error) {
            // you can access all properties of `FetchBaseQueryError` here
            const errMsg = 'error' in error ? error.error : JSON.stringify(error.data);

            toast.error(errMsg);
        }
        else {
            // you can access all properties of `SerializedError` here
            toast.error(error.message);
        }
    }
    const album = data!;

    return (
        <div>
            <h2>{album.title}</h2>
            <h3>{album.artists.map((artist) => (
                <Link key={artist.disc_id} to={`/artists/${artist.disc_id}`}>
                    {artist.name}
                </Link>
            ))}</h3>
            {album.cover ?
                <img src={album.cover} alt={album.title} style={{ height: '400px' }} className="img-thumbnail" /> : <p></p>}
            <p>{album.notes}</p>
            <h4>Average rating of users: {album.avg_rating}</h4>
            <h3>Tracks:</h3>
            <ul>
                {album.tracks.map((track) => (
                    <li key={track.position}>
                        {track.position}. {track.title} ({track.duration})
                    </li>
                ))}
            </ul>
            <h3>Reviews:</h3>
            <ul>
                {album.reviews.map((review) => (
                    <li key={review.id}>
                        <p>{review.creator.first_name} {review.creator.last_name}:</p>
                        <p>{review.text}</p>
                        <p>Created at: {new Date(review.created_at).toLocaleString('en-GB', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric'
                        })}</p>
                        <h3>
                            <Link to={`/reviews/${review.id}`}>
                                Details
                            </Link>
                        </h3>
                    </li>
                ))}
            </ul>

            {auth.account && <NewReview album={album.id} />}
        </div>
    );
};