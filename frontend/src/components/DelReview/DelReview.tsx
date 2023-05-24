import { useDelReviewMutation } from "../../services/albumsApi";
import { AiOutlineDelete } from 'react-icons/ai';


function DelReview({ id }: { id: number; }): JSX.Element {
    const [delReview, { isLoading, error }] = useDelReviewMutation();

    const handleDelReview = () => {
        delReview(id);
    };

    return (
        <div>
            <button disabled={isLoading} onClick={handleDelReview}>
                <AiOutlineDelete />
            </button>
            {error && <div>Error occurred while adding to favorites</div>}
        </div>
    );
}

export default DelReview;