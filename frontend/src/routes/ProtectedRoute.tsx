import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../store";


const ProtectedRoute = ({ children }: { children: JSX.Element; }) => {
    const auth = useSelector((state: RootState) => state.auth);
    return !auth.account ? <Navigate to='/login' /> : children;
};

export default ProtectedRoute;