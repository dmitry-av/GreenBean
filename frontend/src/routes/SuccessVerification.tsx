import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../store";


const SuccessVerification = ({ children }: { children: JSX.Element; }) => {
    const auth = useSelector((state: RootState) => state.auth);
    return !auth.verificationComplete ? <Navigate to='/login' /> : children;
};

export default SuccessVerification;