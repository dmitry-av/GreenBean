import { Link, useParams } from 'react-router-dom';
import { useGetAlbumDetailQuery } from '../../services/albumsApi';
import { toast } from 'react-toastify';
import FavAlbum from '../FavAlbum/FavAlbum';
import DelReview from '../DelReview/DelReview';
import { Login } from '../AuthComponents';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { PopupWindow } from '../AuthComponents';
import ReviewEdit from '../ReviewPopup/ReviewEdit';
import { popupSlice } from '../../store/slices';


function AlbumDetailPage() {
    const { disc_id } = useParams();
    const dispatch = useDispatch();
    const { data, error, isLoading } = useGetAlbumDetailQuery(disc_id, { refetchOnMountOrArgChange: true });
    const auth = useSelector((state: RootState) => state.auth);
    const popup = useSelector((state: RootState) => state.popup);
    const album = data!;

    const handleReviewButton = () => {
        dispatch(popupSlice.actions.setIsPopup(true));
    };


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        if ('status' in error) {
            const errMsg = 'error' in error ? error.error : JSON.stringify(error.data);

            toast.error(errMsg);
        }
        else {
            toast.error(error.message);
        }
    }

    if (!data) {
        return <div>Data is unavailable</div>;
    }


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
            <FavAlbum disc_id={album.disc_id} is_favorite={album.is_favorite} model="albums" />
            <p>{album.notes}</p>
            <h4>Average rating of users: {album.avg_rating}</h4>
            <h4>Likes: {album.favorites}</h4>
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
                        {(review.creator.id === auth.account?.id) ? <DelReview id={review.id} /> : <p></p>}
                        <h3>
                            <Link to={`/reviews/${review.id}`}>
                                Details
                            </Link>
                        </h3>
                    </li>
                ))}
            </ul>

            {!(album.reviews?.map((review) => review.creator.id).includes(auth.account?.id)) && <button onClick={handleReviewButton}>Add a Review</button>}
            {popup.isPopupOpen && (
                <PopupWindow>
                    {auth.account ? (
                        <ReviewEdit album={album.id} initialRating={0} initialText="" />
                    ) : (
                        <Login />
                    )}
                </PopupWindow>
            )}
        </div>
    );
};

export default AlbumDetailPage;