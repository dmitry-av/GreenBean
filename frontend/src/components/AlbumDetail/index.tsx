import { Link, useParams } from 'react-router-dom';
import { useGetAlbumDetailQuery } from '../../services/albumsApi';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { PopupWindow } from '../AuthComponents';
import LoadingIndicator from '../LoadingIndicator';
import ReviewEdit from '../ReviewEdit/ReviewEdit';
import FavAlbum from '../FavAlbum';
import { popupSlice } from '../../store/slices';
import { BsFillStarFill } from "react-icons/bs";
import "./AlbumDetail.css";


function AlbumDetailPage() {
    const { disc_id } = useParams();
    const dispatch = useDispatch();
    const { data, error, isLoading, isSuccess } = useGetAlbumDetailQuery(disc_id!, { refetchOnMountOrArgChange: true });
    const auth = useSelector((state: RootState) => state.auth);
    const popup = useSelector((state: RootState) => state.popup);
    const album = data!;

    const isReviewButton = () => {
        if (auth.account) {
            return !(album.reviews?.map((review) => review.creator.id).includes(auth.account?.id));
        } else {
            return true;
        }
    };
    const handleReviewButton = () => {
        dispatch(popupSlice.actions.setIsPopup(true));
    };

    let content;

    if (isSuccess) {
        content = (<div className="album-detail">
            <h2 className='album-detail__title'>{album.title}</h2>
            <h3 className='album-detail__artist'>{album.artists.map((artist) => (
                <Link key={artist.disc_id} to={`/artists/${artist.disc_id}`}>
                    {artist.name}
                </Link>
            ))}</h3>
            <div className="like-block"><FavAlbum disc_id={album.disc_id} is_favorite={album.is_favorite} model="albums" /><span>{album.favorites}</span></div>
            <div className='album-detail__cont1'>
                {album.cover && <img src={album.cover} alt={album.title} className="album-detail__cont1__cover" />}
                <div className='album-detail__cont1__tracklist'>
                    <h3>Tracklist</h3>
                    <ul className='album-detail__cont1__tracklist__tracks'>
                        {album.tracks.map((track) => (
                            <li key={track.position}>
                                {track.position}. {track.title} ({track.duration})
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <p className='album-detail__album-notes'>{album.notes}</p>
            <h4 className='album-detail__rating-section'>Average rating of users: <span className='album-detail__rating-section__rating'>{album.avg_rating} <BsFillStarFill className="review-item__rating__star-icon" /></span></h4>
            <div className="album-detail__review-block">
                <h4 className="review-block__header">User's reviews:</h4>
                <ul className='review-block__review-list'>
                    {album.reviews.map((review) => (
                        <li className='review-item' key={review.id}>
                            <div className='review-item__name-rating-block'>
                                <p className='review-item__creator_name'>{review.creator.first_name} {review.creator.last_name}</p>
                                <p className='review-item__rating'>Rating: {review.rating} <BsFillStarFill className="review-item__rating__star-icon" /></p>
                            </div>
                            <p className='review-item__date'>{new Date(review.created_at).toLocaleString('en-GB', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric'
                            })}</p>
                            <p className='review-item__review-text'>{review.text.length > 600 ? `${review.text.slice(0, 450)}....` : review.text}</p>
                            <div className='review-item__link-container'><Link to={`/reviews/${review.id}`} className='review-item__link'>
                                open full review..
                            </Link>
                            </div>
                        </li>
                    ))}
                </ul>

                {isReviewButton() && <div className='add-review-container'><button className='btn btn-primary' onClick={handleReviewButton}>Add a Review</button></div>}
                {popup.isPopupOpen && auth.account && <PopupWindow><ReviewEdit album={album.id} initialRating={0} initialText="" /></PopupWindow>}
            </div>
        </div>);
    }

    if (error) {
        return <div className="content-error">Data is unavailable</div>;
    }


    return (
        <div>{isLoading ? <LoadingIndicator /> : content}</div>);
};

export default AlbumDetailPage;