import { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import authSlice from "../../store/slices/authSlice";
import axios from "axios";
import { RootState } from "../../store";
import { Link } from "react-router-dom";
import "./Login.css";
import popupSlice from "../../store/slices/popupSlice";
import { AiOutlineCloseCircle } from "react-icons/ai";


function Login() {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.auth);

    const closePopup = () => {
        dispatch(popupSlice.actions.setIsPopup(false));
    };
    if (auth.account) {
        return null;
    }

    const handleLogin = (username: string, password: string) => {
        axios
            .post(`${import.meta.env.VITE_API_URL}/jwt/login/`, { username, password })
            .then((res) => {
                dispatch(
                    authSlice.actions.setAuthTokens({
                        token: res.data.access,
                        refreshToken: res.data.refresh,
                    })
                );
                dispatch(authSlice.actions.setAccount(res.data.user));
                setLoading(false);
                dispatch(popupSlice.actions.setIsPopup(false));
                window.location.reload();
            })
            .catch((err) => {
                setMessage(err.response.data.detail.toString());
                formik.setValues({ username: "", password: "" });
                setLoading(false);
            });
    };

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        onSubmit: (values) => {
            setLoading(true);
            handleLogin(values.username, values.password);
        },
        validationSchema: Yup.object({
            username: Yup.string().trim().required("Username is required"),
            password: Yup.string().trim().required("Password is required"),
        }),
    });

    return (
        <div className="login-pop-content">
            <div className="login-card p-4">
                <AiOutlineCloseCircle className="close-icon" onClick={closePopup} color="white" size={30} />
                <h3 className="login-text-center">Log in to your account</h3>
                <form onSubmit={formik.handleSubmit} className="login-form">
                    <div className="login-inputs">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            className="form-control"
                            id="username"
                            type="text"
                            autoComplete="username"
                            placeholder="Enter your username"
                            name="username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <div className="text-dangers">{formik.errors.username ? formik.errors.username : null}</div>
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            className="form-control"
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <div className="text-dangers">{formik.errors.password ? formik.errors.password : null}</div>
                    </div>
                    <div className="login-text-danger">
                        {message}
                    </div>
                    <div className="login-button-container">
                        <button
                            type="submit"
                            disabled={loading}
                            className="login-button"
                        >
                            Login
                        </button>
                    </div>
                </form>
                <div className="login-info">Do not have an account? {!auth.account && <Link to="/register">Sign up</Link>}</div>
            </div>
        </div>
    );
}

export default Login;