import { useState } from "react";
import { useNavigate } from "react-router";
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';


function SearchBar() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [term, setTerm] = useState('');

    const handleSearch: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        navigate(`/albums/search/${term}`);
    };

    return (
        <div className="container-fluid">
            <div className="row p-2 pt-3 pb-3 d-flex align-items-center">
                <div className="col-md-2">
                    <img className="d-none d-md-flex" src="https://i.imgur.com/R8QhGhk.png" width="100" />
                </div>
                <div className="col-md-5">
                    <form onSubmit={handleSearch} className="d-flex form-inputs">
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Search any product..."
                            value={term}
                            onChange={(event) => setTerm(event.target.value)}
                        />
                        <span className="icon-inside-input"><FaSearch /></span>
                    </form>
                </div>

                <div className="col-md-2">
                    <div className="d-flex d-none d-md-flex flex-row align-items-center">
                        <span className="shop-bag"><i className='bx bxs-shopping-bag'></i></span>
                        <div className="d-flex flex-column ms-2">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchBar;