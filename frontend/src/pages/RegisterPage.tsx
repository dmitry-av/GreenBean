import { useRegisterMutation } from '../services/authApi';
import { useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import authSlice from "../store/slices/authSlice";
import { useDispatch } from "react-redux";
import * as Yup from "yup";


const RegisterPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validationSchema = () => {
        return Yup.object().shape({
            username: Yup.string()
                .test(
                    "len",
                    "The username must be between 3 and 20 characters.",
                    (val: any) =>
                        val &&
                        val.toString().length >= 3 &&
                        val.toString().length <= 20
                )
                .required("This field is required!"),
            email: Yup.string()
                .email("This is not a valid email.")
                .required("This field is required!"),
            first_name: Yup.string()
                .required("This field is required!"),
            last_name: Yup.string()
                .required("This field is required!"),
            password: Yup.string()
                .test(
                    "len",
                    "The password must be between 6 and 40 characters.",
                    (val: any) =>
                        val &&
                        val.toString().length >= 6 &&
                        val.toString().length <= 40
                )
                .required("This field is required!"),
            password_confirm: Yup.string().nullable().oneOf([Yup.ref('password'), null], 'Passwords must match')
        });
    };

    const [register, { isLoading, isError, isSuccess, error, status }] = useRegisterMutation();

    const formik = useFormik({
        initialValues: {
            username: '',
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            password_confirm: '',
        },
        onSubmit: async (values) => {
            await register(values);
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
                } else {
                    // you can access all properties of `SerializedError` here
                    return <div>{error.message}</div>;
                }
            }
            else {
                dispatch(authSlice.actions.setIsMailSent(true));
                dispatch(authSlice.actions.setVerificationComplete(false));
                navigate('/verify-notify', { replace: true });
            }

        },
        validationSchema: validationSchema
    });

    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="card p-4">
                <h1 className="text-center mb-4">Sign up form</h1>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            className="form-control"
                            id="username"
                            type="text"
                            autoComplete="off"
                            placeholder="Enter your username"
                            name="username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <div className="text-danger">{formik.errors.username ? formik.errors.username : null}</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Email</label>
                        <input
                            className="form-control"
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <div className="text-danger">{formik.errors.email ? formik.errors.email : null}</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">First name</label>
                        <input
                            className="form-control"
                            id="first_name"
                            type="text"
                            placeholder="Enter your first name"
                            name="first_name"
                            value={formik.values.first_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <div className="text-danger">{formik.errors.first_name ? formik.errors.first_name : null}</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Last name</label>
                        <input
                            className="form-control"
                            id="last_name"
                            type="text"
                            placeholder="Enter your first name"
                            name="last_name"
                            value={formik.values.last_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <div className="text-danger">{formik.errors.last_name ? formik.errors.last_name : null}</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            className="form-control"
                            id="password"
                            autoComplete="new-password"
                            type="password"
                            placeholder="Enter your password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <div className="text-danger">{formik.errors.password ? formik.errors.password : null}</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password_confirm" className="form-label">Repeat password</label>
                        <input
                            className="form-control"
                            id="password_confirm"
                            type="password"
                            autoComplete="new-password"
                            placeholder="Reenter your password"
                            name="password_confirm"
                            value={formik.values.password_confirm}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <div className="text-danger">{formik.errors.password_confirm ? formik.errors.password_confirm : null}</div>
                    </div>
                    <div className="text-danger text-center my-2" hidden={false}>
                    </div>
                    <div className="d-grid gap-2 mt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary btn-block"
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default RegisterPage;