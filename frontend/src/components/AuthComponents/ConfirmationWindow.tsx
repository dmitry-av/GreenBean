import { useDispatch } from "react-redux";
import { popupSlice } from "../../store/slices";
import "./ConfirmationWindow.css";

interface ConfirmationWindowProps {
    text: string;
    handleDelReview: () => void;
}

function ConfirmationWindow({ text, handleDelReview }: ConfirmationWindowProps): JSX.Element {
    const dispatch = useDispatch();
    const closePopup = () => {
        dispatch(popupSlice.actions.setConfirmPopup(false));
    };

    return (
        <div className="confirmation-window">
            <h4 className="confirmation-text">{text}</h4>
            <div className="buttons-container">
                <button
                    className="confirm-button"
                    onClick={handleDelReview}
                >
                    Yes
                </button>
                <button
                    className="confirm-button"
                    onClick={closePopup}
                >
                    No
                </button>
            </div>
        </div>
    );
}

export default ConfirmationWindow;