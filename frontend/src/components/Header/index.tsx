import { Link } from 'react-router-dom';
import { RootState } from '../../store';
import SearchBar from '../SearchBar';
import { useSelector } from 'react-redux';

const Header = () => {
    const auth = useSelector((state: RootState) => state.auth);
    return (
        <div>
            {auth.account && <Link to="/">Profile</Link>}
            <span>{!auth.account && <Link to="/login">Sign in</Link>}</span>
            <span>{!auth.account && <Link to="/register">Sign up</Link>}</span>
            <SearchBar />
        </div>
    );
};

export default Header;