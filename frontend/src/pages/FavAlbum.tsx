import { useEffect, useState } from "react";
import { useAddToFavMutation, useDelFromFavMutation } from "../services/albumsApi";
import { NewFav } from "../models/album";

function FavAlbum({ disc_id, is_favorite, model }: NewFav): JSX.Element {
    const [isFavorite, setIsFavorite] = useState(is_favorite); // Initial favorite state
    console.log(is_favorite);
    const [addFav, { isLoading: addLoading, isSuccess: addSuccess, error: addError }] = useAddToFavMutation();
    const [delFav, { isLoading: delLoading, isSuccess: delSuccess, error: delError }] = useDelFromFavMutation();

    const handleToggleFavorite = () => {
        if (isFavorite) {
            delFav({ disc_id, model });

        } else {
            addFav({ disc_id, model });
        }
    };

    useEffect(() => {
        // Update the favorite state based on mutation results
        if (delSuccess) {
            setIsFavorite(false);
        }
        if (addSuccess) {
            setIsFavorite(true);
        }
    }, [delSuccess, addSuccess]);

    useEffect(() => {
        // Update the favorite state when the component is mounted
        setIsFavorite(is_favorite);
    }, [is_favorite]);


    return (
        <div>
            <button onClick={handleToggleFavorite} disabled={addLoading || delLoading}>
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
            {addError && <div>Error occurred while adding to favorites</div>}
            {delError && <div>Error occurred while add deleting from favorites</div>}
        </div>
    );
}

export default FavAlbum;