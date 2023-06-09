import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import authSlice from "../../store/slices/authSlice";
import { RootState } from "../../store";


const Profile = () => {
    const account = useSelector((state: RootState) => state.auth.account);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(authSlice.actions.setLogout());
        navigate("/");
    };
    return (
        <div className="h-100 d-flex flex-column justify-content-center align-items-center">
            <div className="w-100 p-3">
                <button
                    onClick={handleLogout}
                    className="btn btn-danger rounded-pill px-4 py-2"
                >Log out</button>
            </div>
            {account ? (
                <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                    <p className="my-auto">Welcome, {account?.first_name} {account?.last_name}</p>
                </div>
            ) : (
                <p className="w-100 d-flex align-items-center justify-content-center">Loading ...</p>
            )}
        </div>
    );
};

export default Profile;