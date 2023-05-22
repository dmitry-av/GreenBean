import { useGetAlbumsQuery } from "../services/albumsApi";
import { Album } from "../models/album";
import { useState } from "react";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const PAGE_SIZE = 100;

export const AlbumsList = () => {
    const [page, setPage] = useState<number>(1);
    const { data, error, isLoading } = useGetAlbumsQuery(page);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        if ('status' in error) {
            // you can access all properties of `FetchBaseQueryError` here
            const errMsg = 'error' in error ? error.error : JSON.stringify(error.data);

            toast.error(errMsg);
        }
        else {
            // you can access all properties of `SerializedError` here
            toast.error(error.message);
        }
    }

    if (!data) {
        // Handle the case where data is undefined
        return <div>Data is unavailable</div>;
    }

    const { albums, count, next, previous } = data;
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
        <section className="albums-list">
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
            <h2>Albums</h2>
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