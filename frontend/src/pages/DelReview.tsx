import { useDelReviewMutation } from "../services/albumsApi";


function DelReview(id: number): JSX.Element {
    const [delReview, { isLoading, error }] = useDelReviewMutation();

    const handleDelReview = () => {
        delReview(id);
    };

    return (
        <div>
            <button disabled={isLoading} onClick={handleDelReview}>
                Delete the review
            </button>
            {error && <div>Error occurred while adding to favorites</div>}
        </div>
    );
}

export default DelReview;