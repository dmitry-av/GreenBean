import { useDispatch } from "react-redux";
import { popupSlice } from "../../store/slices";
import { Link } from "react-router-dom";

function UnauthenticatedAccessPage() {
    const dispatch = useDispatch();
    const handleLoginClick = () => {
        dispatch(popupSlice.actions.setIsPopup(true));
    };
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <div className="card mt-5">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Authentication Required</h2>
                            <p className="card-text text-center">
                                This page requires authentication.
                            </p>
                            <p className="card-text text-center">
                                Please login or sign up to access the content.
                            </p>
                            <div className="d-flex justify-content-center mt-4">
                                <a href="#" onClick={handleLoginClick}>Sign in</a>
                                <Link to="/register" className="btn btn-secondary">
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnauthenticatedAccessPage;