import { Link, useParams } from "react-router-dom";
import { useSearchAlbumsQuery } from "../../services/albumsApi";
import { Album } from "../../models/album";
import { useState } from "react";
import { toast } from 'react-toastify';
import searchLoader from '../../assets/loader.gif';
import "./SeachResults.css";


const PAGE_SIZE = 100;


function SearchResults() {
    const { term } = useParams();
    const [page, setPage] = useState<number>(1);
    const { data, error, isLoading, isFetching } = useSearchAlbumsQuery(term, { refetchOnMountOrArgChange: true });

    if (isLoading || isFetching) {
        return <img
            src={searchLoader}
            alt="search-loader"
            height="75"
        />;
    }

    if (error) {
        if ('status' in error) {
            const errMsg = 'error' in error ? error.error : JSON.stringify(error.data);

            toast.error(errMsg);
        }
        else {
            toast.error(error.message);
        }
    }

    const { albums, count, next, previous } = data!;
    const totalPages = Math.ceil(count / PAGE_SIZE);

    const renderedAlbums = albums.map((album: Album) => (
        <article className="album-search-card col-12 col-md-7 col-sm-10" key={album.disc_id}>
            <Link to={`/albums/${album.disc_id}`} className="album-link">
                <div className="result-content">
                    <div className="album-image-container">
                        <img
                            src={album.cover_ext_url}
                            alt={album.title}
                            width="95"
                            height="95"
                            className="album-image"
                        />
                    </div>
                    <div className="album-details">
                        <span className="album-title">{album.title}</span>
                        <span className="album-year">{album.year}</span>
                    </div>
                </div>
            </Link>
        </article>
    ));

    const handlePreviousPage = () => {
        if (previous !== null) {
            setPage((prevPage) => prevPage - 1);
        }
    };

    const handleNextPage = () => {
        if (next !== null) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const pagination = (<div className="pagination">
        <button onClick={handlePreviousPage} disabled={previous === null}>
            Previous
        </button>
        <span>
            Page {page} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={next === null}>
            Next
        </button>
    </div>);

    return (
        <section className="search-results">
            <h3 className="results-heading">Search results</h3>
            {(previous !== null && next !== null) && pagination}
            {renderedAlbums}
            {(previous !== null && next !== null) && pagination}
        </section>
    );
};

export default SearchResults;