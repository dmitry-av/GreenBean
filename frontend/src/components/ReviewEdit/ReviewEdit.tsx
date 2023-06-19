import React, { useState } from "react";
import { useAddReviewMutation, useUpdateReviewMutation } from "../../services/albumsApi";
import { useDispatch } from "react-redux";
import { popupSlice } from "../../store/slices";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BsFillStarFill } from "react-icons/bs";
import "./ReviewEdit.css";

interface ReviewForm {
    album: number;
    initialText: string;
    initialRating: number;
    isEditing?: boolean;
    id?: number;
}

function ReviewEdit({ album, initialText, initialRating, isEditing, id }: ReviewForm): JSX.Element {
    const dispatch = useDispatch();
    const [text, setText] = useState(initialText);
    const [rating, setRating] = useState(initialRating);

    const [addReview, { isLoading: isAdding, error: addError }] =
        useAddReviewMutation();
    const [updateReview, { isLoading: isUpdating, error: updateError }] =
        useUpdateReviewMutation();

    const closePopup = () => {
        dispatch(popupSlice.actions.setIsPopup(false));
    };

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        const body = { album, text: text, rating: rating };
        if (text.trim() !== "" && rating >= 1 && rating <= 10) {
            if (isEditing && id) {
                // Perform update review logic using the updateReview mutation
                updateReview({ id, body });
            } else {
                // Perform add review logic using the addReview mutation
                addReview(body);
            }
            dispatch(popupSlice.actions.setIsPopup(false));
        }
    };

    return (
        <div className="review-pop-content">
            <div className="review-window p-4">
                <AiOutlineCloseCircle className="close-icon" onClick={closePopup} size={30} />
                <form onSubmit={submitForm} className="review-form">
                    <div className="review-text-container">
                        <textarea
                            id="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="review-form-control"
                        />
                    </div>
                    <div className="rating-select-cont">
                        <label htmlFor="rating">Rating</label>
                        <select
                            id="rating"
                            value={rating}
                            className="review-form-select"
                            onChange={(e) => setRating(Number(e.target.value))}
                        >
                            <option value="">select</option>
                            {Array.from({ length: 10 }, (_, index) => (
                                <option key={index + 1} value={index + 1}>
                                    <BsFillStarFill />{index + 1}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary rounded-pill" disabled={isAdding || isUpdating}>
                        Submit
                    </button>
                    {addError && <span>Error occurred while adding review.</span>}
                    {updateError && <span>Error occurred while updating review.</span>}
                </form>
            </div>
        </div>
    );
}

export default ReviewEdit;