import React, { useState } from "react";
import ReviewEdit from "./ReviewEdit";
import './ReviewPopup.css';

interface ReviewPopupProps {
    album: number;
    initialText: string;
    initialRating: number;
    isEditing?: boolean;
    id?: number;
}

const ReviewPopup: React.FC<ReviewPopupProps> = ({ album, initialText, initialRating, isEditing, id }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openPopup = () => {
        setIsOpen(true);
    };

    const closePopup = () => {
        setIsOpen(false);
    };

    return (
        <div>
            <button onClick={openPopup}>{isEditing ? <>Edit the Review</> : <>Add a Review</>}</button>
            {isOpen && (
                <div className="popup-container">
                    <div className="popup-content">
                        <button onClick={closePopup}>Close</button>
                        <ReviewEdit album={album} closePopup={closePopup} initialRating={initialRating} initialText={initialText} isEditing={isEditing} id={id} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewPopup;
