import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

const Header = () => {
    return (
        <div>
            <Link to="/">Profile</Link>
            <Link to="/albums">Albums</Link>
            <SearchBar />
        </div>
    );
};

export default Header;