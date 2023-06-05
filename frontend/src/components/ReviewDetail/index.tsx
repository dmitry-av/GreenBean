import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetReviewDetailQuery } from '../../services/albumsApi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import DelReview from '../DelReview';
import LoadingIndicator from '../LoadingIndicator';
import { FaEdit } from "react-icons/fa";
import { AiOutlineRollback } from "react-icons/ai";
import { popupSlice } from '../../store/slices';
import { PopupWindow } from '../AuthComponents';
import ReviewEdit from '../ReviewEdit/ReviewEdit';
import { BsFillStarFill } from 'react-icons/bs';
import "./ReviewDetail.css";


function ReviewDetailPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { data, error, isLoading, isSuccess } = useGetReviewDetailQuery(id!, { refetchOnMountOrArgChange: true });
    const auth = useSelector((state: RootState) => state.auth);
    const popup = useSelector((state: RootState) => state.popup);
    const navigate = useNavigate();
    const review = data!;

    const handleReviewButton = () => {
        dispatch(popupSlice.actions.setIsPopup(true));
    };

    let content;
    if (error) {
        content = <p>An error occured</p>;
    }

    if (isSuccess) {
        content = <div className='review-detail'>
            <h2 className='review-detail__creator'>{review.creator.first_name} {review.creator.last_name}</h2>
            <div className='review-detail___title_cont flex-column flex-md-row'>
                <h4 className='review-detail__title'>
                    <Link to={`/albums/${review.album.disc_id}`} className='review-detail__album-link'>{review.album.title}</Link>
                </h4>
                <h4 className='review-detail__artist'>{review.album.artists.map((artist) => (
                    <Link key={artist.disc_id} to={`/artists/${artist.disc_id}`}>
                        {artist.name}
                    </Link>
                ))}</h4>
            </div>
            <p className='review-detail__text'>{review.text}</p>
            <h3 className='review-detail__rating'>Rating: {review.rating} <BsFillStarFill className="review-item__rating__star-icon" /></h3>
            <h4 className='review-detail__date'>Modified: {new Date(review.modified_at).toLocaleString('en-GB', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            })}</h4>
            <div className='review-detail__icons-container'>
                <div className='review-detail__icons-container__edit-block'>
                    {(review.creator.id === auth.account?.id) && <FaEdit className="review-detail__edit-button" onClick={handleReviewButton} size={25} />}
                    {popup.isPopupOpen && auth.account &&
                        <PopupWindow>
                            <ReviewEdit id={review.id} album={review.album.id} initialText={review.text} initialRating={review.rating} isEditing={true} />
                        </PopupWindow>
                    }
                    {(review.creator.id === auth.account?.id) ? <DelReview id={review.id} /> : null}
                </div>
                <div>
                    <AiOutlineRollback onClick={() => navigate(-1)} size={25} className="review-detail__back-button" />
                </div>
            </div>
        </div>;
    }

    return (
        <div>{(isLoading) ? <LoadingIndicator /> : content}</div>
    );
};

export default ReviewDetailPage;