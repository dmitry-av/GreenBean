import { useSelector } from "react-redux";
import { RootState } from "../store";
import UnauthenticatedAccessPage from "../components/AuthComponents/UnauthorizedPage";


const ProtectedRoute = ({ children }: { children: JSX.Element; }) => {
    const auth = useSelector((state: RootState) => state.auth);
    return !auth.account ? <UnauthenticatedAccessPage /> : children;
};

export default ProtectedRoute;