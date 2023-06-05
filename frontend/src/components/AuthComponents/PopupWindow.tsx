import { ReactNode } from "react";
import "./PopupWindow.css";

interface PopupWindowProps {
    children: ReactNode;
};

function PopupWindow({ children }: PopupWindowProps) {
    return (
        <div className="pop-container" style={{ zIndex: 9999 }}>
            {children}
        </div>
    );
}

export default PopupWindow;