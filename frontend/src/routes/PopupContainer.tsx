import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Login, PopupWindow } from "../components/AuthComponents";


const PopupContainer = () => {
    const auth = useSelector((state: RootState) => state.auth);
    const popup = useSelector((state: RootState) => state.popup);

    return !auth.account && popup.isPopupOpen ? <PopupWindow><Login /></PopupWindow> : null;
};

export default PopupContainer;