import { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import authSlice from "../../store/slices/authSlice";
import axios from "axios";
import { useNavigate } from "react-router";
import { RootState } from "../../store";
import { Link } from "react-router-dom";

function Login() {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useSelector((state: RootState) => state.auth);

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
                navigate("/", { state: { userId: res.data.id } });
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
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="card p-5">
                <h2 className="text-center mb-4">Log in to your account</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="form-floating mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            className="form-control"
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            name="username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <div className="text-danger">{formik.errors.username ? formik.errors.username : null}</div>
                    </div>
                    <div className="form-floating mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            className="form-control"
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <div className="text-danger">{formik.errors.password ? formik.errors.password : null}</div>
                    </div>
                    <div className="text-danger text-center my-2" hidden={false}>
                        {message}
                    </div>
                    <div className="d-grid gap-2 mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary btn-block"
                        >
                            Login
                        </button>
                    </div>
                </form>
                <span>Already have an account? {!auth.account && <Link to="/register">Sign up</Link>}</span>
            </div>
        </div>
    );
}

export default Login;