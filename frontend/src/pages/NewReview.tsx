import React, { useState } from "react";
import { useAddReviewMutationMutation } from "../services/albumsApi";


function NewReview({ album }: { album: number; }): JSX.Element {
    const [text, setText] = useState("");
    const [rating, setRating] = useState(0);

    const [addReview, { isLoading, isSuccess, error }] =
        useAddReviewMutationMutation();

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim() !== "" && rating >= 1 && rating <= 10) {
            addReview({ album, text, rating });
            setText("");
            setRating(0);
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
            <button type="submit" className="btn btn-primary my-3 rounded-pill" disabled={isLoading}>
                Submit
            </button>
            {isLoading && <span>Adding review...</span>}
            {isSuccess && <span>Review added successfully!</span>}
            {error && <span>Error occurred while adding review.</span>}
        </form>
    );
}

export default NewReview;