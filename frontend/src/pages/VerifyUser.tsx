import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function VerifyUser() {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get("user_id");
        const timestamp = urlParams.get("timestamp");
        const signature = urlParams.get("signature");

        axios
            .post(`${import.meta.env.VITE_API_URL}/accounts/verify-registration/`, {
                user_id: userId,
                timestamp: timestamp,
                signature: signature,
            })
            .then((response) => {
                console.log(response.status);
                // Handle the response from the server
                navigate("/verify-successful");
            })
            .catch((error) => {
                console.log(error);
                // Handle the error
            });
    }, [navigate]);

    return <div>Verifying user...</div>;
}

export default VerifyUser;