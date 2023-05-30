import { useState } from "react";
import { useNavigate } from "react-router";
import './SearchBar.css';


function SearchBar() {
    const navigate = useNavigate();
    const [term, setTerm] = useState('');

    const handleSearch: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        navigate(`/albums/search/${term}`);
        setTerm('');
    };

    return (
        <form onSubmit={handleSearch} className="form-inline">
            <div className="input-group">
                <input
                    className="form-control"
                    type="text"
                    placeholder="Search the music..."
                    value={term}
                    onChange={(event) => setTerm(event.target.value)}
                />
            </div>
        </form>
    );
}

export default SearchBar;