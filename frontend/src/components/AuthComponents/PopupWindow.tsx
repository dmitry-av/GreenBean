import { ReactNode } from "react";
import { AiFillCloseSquare } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { popupSlice } from "../../store/slices";

interface PopupWindowProps {
    children: ReactNode;
};

function PopupWindow({ children }: PopupWindowProps) {
    const dispatch = useDispatch();
    const closePopup = () => {
        dispatch(popupSlice.actions.setIsPopup(false));
    };
    return (
        <div className="popup-container">
            <div className="popup-content">
                <button onClick={closePopup}><AiFillCloseSquare /></button>
                {children}
            </div>
        </div>
    );
}

export default PopupWindow;