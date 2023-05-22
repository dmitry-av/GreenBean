import { Link, useParams } from "react-router-dom";
import { useSearchAlbumsQuery } from "../services/albumsApi";
import { Album } from "../models/album";
import { useState } from "react";
import { toast } from 'react-toastify';

const PAGE_SIZE = 100;


function SearchResults() {
    const { term } = useParams();
    const [page, setPage] = useState<number>(1);
    const { data, error, isLoading } = useSearchAlbumsQuery(term);

    if (isLoading) {
        return <div>Loading...</div>;
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
        <article className="post-excerpt" key={album.disc_id}>
            <h3>
                <Link to={`/albums/${album.disc_id}`}>
                    {album.full_title} - {album.year}
                </Link>
            </h3>
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

    return (
        <section className="posts-list">
            <h2>Albums</h2>
            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={previous === null}>
                    Previous
                </button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={next === null}>
                    Next
                </button>
            </div>
            {renderedAlbums}
            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={previous === null}>
                    Previous
                </button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={next === null}>
                    Next
                </button>
            </div>
        </section>
    );
};

export default SearchResults;