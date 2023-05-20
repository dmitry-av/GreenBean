import React, { useState } from "react";
import { useAddReviewMutation, useUpdateReviewMutation } from "../services/albumsApi";

interface ReviewForm {
    album: number;
    initialText: string;
    initialRating: number;
    isEditing?: boolean;
    id?: number;
    closePopup: () => void;
}

function ReviewEdit({ album, initialText, initialRating, isEditing, id, closePopup }: ReviewForm): JSX.Element {
    const [text, setText] = useState(initialText);
    const [rating, setRating] = useState(initialRating);

    const [addReview, { isLoading: isAdding, isSuccess: addSuccess, error: addError }] =
        useAddReviewMutation();
    const [updateReview, { isLoading: isUpdating, isSuccess: updateSuccess, error: updateError }] =
        useUpdateReviewMutation();

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
            closePopup();
        }
    };

    return (
        <form onSubmit={submitForm}>
            <div>
                <label htmlFor="text">Review:</label>
                <textarea
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="form-control"
                />
            </div>
            <div>
                <label htmlFor="rating">Rating:</label>
                <select
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                >
                    <option value="">Select rating</option>
                    {Array.from({ length: 10 }, (_, index) => (
                        <option key={index + 1} value={index + 1}>
                            {index + 1}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit" className="btn btn-primary my-3 rounded-pill" disabled={isAdding || isUpdating}>
                Submit
            </button>
            {isAdding && <span>Adding review...</span>}
            {addSuccess && <span>Review added successfully!</span>}
            {addError && <span>Error occurred while adding review.</span>}
            {isUpdating && <span>Updating review...</span>}
            {updateSuccess && <span>Review updated successfully!</span>}
            {updateError && <span>Error occurred while updating review.</span>}
        </form>
    );
}

export default ReviewEdit;