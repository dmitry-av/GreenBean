import { useDelReviewMutation } from "../../services/albumsApi";
import { AiOutlineDelete } from 'react-icons/ai';
import "./DelReview.css";
import { useNavigate } from "react-router-dom";


function DelReview({ id }: { id: number; }): JSX.Element {
    const [delReview, { isLoading }] = useDelReviewMutation();
    const navigate = useNavigate();

    const handleDelReview = () => {
        delReview(id);
        navigate(-1);
    };

    return (
        <div className="delete-button-container">
            <AiOutlineDelete className="delete-button" onClick={handleDelReview} disabled={isLoading} size={25} />
        </div>
    );
}

export default DelReview;