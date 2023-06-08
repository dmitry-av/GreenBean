import { useState } from "react";
import { useNavigate } from "react-router";
import './SearchBar.css';


function SearchBar() {
    const navigate = useNavigate();
    const [term, setTerm] = useState('');
    const [searchType, setSearchType] = useState('albums');

    const handleSearch: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        navigate(`/${searchType}/search/${term}`);
        setTerm('');
    };

    return (
        <form onSubmit={handleSearch} className="form-inline">
            <div className="search-input-group">
                <input
                    className="search-form-control"
                    type="text"
                    placeholder="Search the music..."
                    value={term}
                    onChange={(event) => setTerm(event.target.value)}
                />
                <select
                    className="search-type-select"
                    value={searchType}
                    onChange={(event) => setSearchType(event.target.value)}
                >
                    <option className="search-type-select-item" value="albums">Albums</option>
                    <option className="search-type-select-item" value="artists">Artists</option>
                </select>
            </div>
        </form>
    );
}

export default SearchBar;