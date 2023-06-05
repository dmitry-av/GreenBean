import { useEffect, useState } from "react";
import { useAddToFavMutation, useDelFromFavMutation } from "../../services/albumsApi";
import { NewFav } from "../../models/album";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import { popupSlice } from "../../store/slices";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { PopupWindow, Login } from "../AuthComponents";
import "./FavAlbum.css";


function FavAlbum({ disc_id, is_favorite, model }: NewFav): JSX.Element {
    const auth = useSelector((state: RootState) => state.auth);
    const popup = useSelector((state: RootState) => state.popup);
    const dispatch = useDispatch();
    const [isFavorite, setIsFavorite] = useState(is_favorite); // Initial favorite state
    const [addFav, { isLoading: addLoading, isSuccess: addSuccess, error: addError }] = useAddToFavMutation();
    const [delFav, { isLoading: delLoading, isSuccess: delSuccess, error: delError }] = useDelFromFavMutation();

    const handleToggleFavorite = () => {
        if (auth.account) {
            if (isFavorite) {
                delFav({ disc_id, model });

            } else {
                addFav({ disc_id, model });
            }
        } else { dispatch(popupSlice.actions.setIsPopup(true)); }
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
        <div className="fav-button-container">
            <button
                onClick={handleToggleFavorite}
                disabled={addLoading || delLoading}
                className="fav-button"
            >
                {isFavorite ? (
                    <MdFavorite color="red" className="heart-icon" size={35} />
                ) : (
                    <MdFavoriteBorder color="red" className="heart-icon" size={35} />
                )}
            </button>
            {addError && (
                <div>Error occurred while adding to favorites</div>
            )}
            {delError && (
                <div>Error occurred while deleting from favorites</div>
            )}
            {popup.isPopupOpen && <PopupWindow children={<Login />} />}
        </div>
    );
}

export default FavAlbum;