import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import SearchBar from '../SearchBar';
import authSlice from "../../store/slices/authSlice";
import { useDispatch, useSelector } from 'react-redux';
import invLogo from "../../assets/logo-inverted.png";
import { popupSlice } from '../../store/slices';
import "./Header.css";

const Header = () => {
    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const handleLoginClick = () => {
        dispatch(popupSlice.actions.setIsPopup(true));
    };
    const handleLogout = () => {
        dispatch(authSlice.actions.setLogout());
        window.location.reload();
    };

    const usersection = (
        <div className="dropdown" data-bs-hover="dropdown">
            <a
                className="d-block link-dark text-decoration-none dropdown-toggle"
                id="dropdownUser1"
                aria-expanded="false"
            >
                <img
                    src="https://icon-library.com/images/generic-profile-icon/generic-profile-icon-10.jpg"
                    alt="mdo"
                    width="32"
                    height="32"
                    className="rounded-circle"
                />
                <span className="p-2">{auth.account?.username}</span>

            </a>
            <ul className="dropdown-menu text-small" aria-labelledby="dropdownUser1">
                <li><Link className="dropdown-item" to="/">Profile</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a href="#" className="dropdown-item" onClick={handleLogout}>Log out</a></li>
            </ul>
        </div>
    );

    const authsection = <a href="#" onClick={handleLoginClick}>Sign in</a>;


    return (
        <header className="main-header container-fluid">
            <div className='d-flex align-items-center'>
                <div className='header-image'>
                    <img
                        src={invLogo}
                        alt="inverted logo"
                        width="160"
                        height="60"
                        onClick={() => navigate('/')}
                    />
                </div>

                <div className="header-item">
                    {auth.account ? usersection : authsection}
                </div>
            </div>
            <div className='searchbar'><SearchBar /></div>
        </header>
    );
};

export default Header;