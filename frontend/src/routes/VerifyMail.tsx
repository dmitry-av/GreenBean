import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../store";


const VerifyMail = ({ children }: { children: JSX.Element; }) => {
    const auth = useSelector((state: RootState) => state.auth);
    return !auth.verifyMailSent ? <Navigate to='/' /> : children;
};

export default VerifyMail;