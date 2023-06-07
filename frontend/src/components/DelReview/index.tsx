import { useDelReviewMutation } from "../../services/albumsApi";
import { AiOutlineDelete } from 'react-icons/ai';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { popupSlice } from '../../store/slices';
import "./DelReview.css";
import { PopupWindow } from "../AuthComponents";
import ConfirmationWindow from "../AuthComponents/ConfirmationWindow";


function DelReview({ id }: { id: number; }): JSX.Element {
    const [delReview, { isLoading }] = useDelReviewMutation();
    const popup = useSelector((state: RootState) => state.popup);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const openConfirmPopup = () => {
        dispatch(popupSlice.actions.setConfirmPopup(true));
    };

    const handleDelReview = () => {
        delReview(id);
        dispatch(popupSlice.actions.setConfirmPopup(false));
        navigate(-1);
    };

    const text = "Do you really want to delete your review?";

    return (
        <div className="delete-button-container">
            <AiOutlineDelete className="delete-button" onClick={openConfirmPopup} disabled={isLoading} size={25} />
            {popup.isConfirmPopup && <PopupWindow><ConfirmationWindow text={text} handleDelReview={handleDelReview} /></PopupWindow>}
        </div>
    );
}

export default DelReview;