import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetReviewDetailQuery } from '../services/albumsApi';


export const ReviewDetailPage = () => {
    const { id } = useParams();
    const { data, error, isLoading } = useGetReviewDetailQuery(id!);
    const navigate = useNavigate();

    function handleClick() {
        navigate(-1); // go back one page
    }
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        if ('status' in error) {
            // you can access all properties of `FetchBaseQueryError` here
            const errMsg = 'error' in error ? error.error : JSON.stringify(error.data);

            return (
                <div>
                    <div>An error has occurred:</div>
                    <div>{errMsg}</div>
                </div>
            );
        } else {
            // you can access all properties of `SerializedError` here
            return <div>{error.message}</div>;
        }
    }

    const review = data!;

    return (
        <div>
            <h2>{review.creator.first_name} {review.creator.last_name}</h2>
            <h3><Link to={`/albums/${review.album.disc_id}`}>{review.album.title}</Link> - {review.album.artists.map((artist) => artist.name).join(", ")}</h3>
            <p>{review.text}</p>
            <h3>Rating: {review.rating}</h3>
            <h4>Created: {new Date(review.created_at).toLocaleString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            })}</h4>
            <h4>Updated: {new Date(review.modified_at).toLocaleString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            })}</h4>
            <div>
                <button onClick={handleClick}>Go back</button>
            </div>
        </div>
    );
};