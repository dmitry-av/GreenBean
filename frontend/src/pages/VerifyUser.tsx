import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useVerificationMutation } from "../services/authApi";
import authSlice from "../store/slices/authSlice";
import { useDispatch } from "react-redux";


function VerifyUser() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const urlParams = new URLSearchParams(window.location.search);
    const [verification, { isLoading, isError, isSuccess, data, error }] = useVerificationMutation();

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
            navigate("/verify-successful");
        }
    }, [isSuccess, isError]);

    if (error) {
        if ('status' in error) {
            // you can access all properties of `FetchBaseQueryError` here
            const errMsg = 'error' in error ? error.error : JSON.stringify(error.data);

            return (
                <div>
                    <div>An error has occurred:</div>
                    <div>{errMsg}</div>
                </div>
            );
        }
        else {
            // you can access all properties of `SerializedError` here
            return <div>{error.message}</div>;
        }
    }

    return <div><h2>Verification page</h2>{isLoading && <div>Verifying user...</div>}</div>;
}

export default VerifyUser;


// axios
// .post(`${import.meta.env.VITE_API_URL}/accounts/verify-registration/`, {
//     user_id: userId,
//     timestamp: timestamp,
//     signature: signature,
// })
// .then((response) => {
//     console.log(response.status);
//     // Handle the response from the server
//     navigate("/verify-successful");
// })
// .catch((error) => {
//     console.log(error);
//     // Handle the error
// });
// }, [navigate]);