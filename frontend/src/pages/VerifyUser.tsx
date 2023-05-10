import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVerificationMutation } from "../services/authApi";
import authSlice from "../store/slices/authSlice";
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';


function VerifyUser() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const urlParams = new URLSearchParams(window.location.search);
    const [verification, { isLoading, isError, isSuccess, error }] = useVerificationMutation();

    useEffect(() => {
        const requestData = {
            user_id: urlParams.get("user_id"),
            timestamp: urlParams.get("timestamp"),
            signature: urlParams.get("signature"),
        };
        verification(requestData);
    }, []);

    useEffect(() => {
        if (isSuccess) {
            dispatch(authSlice.actions.setIsMailSent(false));
            dispatch(authSlice.actions.setVerificationComplete(true));
            navigate("/verify-successful");
        }
    }, [isSuccess, isError]);

    if (error) {
        if ('status' in error) {
            // you can access all properties of `FetchBaseQueryError` here
            const errMsg = 'error' in error ? error.error : JSON.stringify(error.data);

            toast.error(errMsg);
        }
        else {
            // you can access all properties of `SerializedError` here
            toast.error(error.message);
        }
    }

    return <div><h2>Verification page</h2>{isLoading && <div>Verifying user...</div>}</div>;
}

export default VerifyUser;