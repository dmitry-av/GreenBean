import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import SearchBar from '../SearchBar';
import authSlice from "../../store/slices/authSlice";
import { useDispatch, useSelector } from 'react-redux';
import invLogo from "../../assets/logo-inverted.png";
import "./Header.css";

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useSelector((state: RootState) => state.auth);
    const handleLogout = () => {
        dispatch(authSlice.actions.setLogout());
        navigate("/login");
    };
    return (
        <header className="main-header p-2">
            <div className="container-fluid">
                <div className="main-links d-flex flex-column flex-sm-row justify-content-between">
                    <div className='header-item'>
                        <span className="p-2">{!auth.account && <Link to="/login">Sign in</Link>}</span>
                        <span className="p-2">{!auth.account && <Link to="/register">Sign up</Link>}</span>
                    </div>
                    <div className='header-image'>
                        <img
                            src={invLogo}
                            alt="inverted logo"
                            width="160"
                            height="60"
                        />
                    </div>

                    <div className="header-item d-flex align-items-center">
                        <span className="p-1"><SearchBar /></span>
                        {auth.account && (
                            <div className="dropdown text-end" data-bs-hover="dropdown">
                                <a
                                    className="d-block link-dark text-decoration-none dropdown-toggle"
                                    id="dropdownUser1"
                                    aria-expanded="false"
                                >
                                    <span className="p-2">{auth.account.username}</span>
                                    <img
                                        src="https://icon-library.com/images/generic-profile-icon/generic-profile-icon-10.jpg"
                                        alt="mdo"
                                        width="32"
                                        height="32"
                                        className="rounded-circle"
                                    />
                                </a>
                                <ul className="dropdown-menu text-small" aria-labelledby="dropdownUser1">
                                    <li><Link className="dropdown-item" to="/">Profile</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" onClick={handleLogout}>Log out</a></li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;