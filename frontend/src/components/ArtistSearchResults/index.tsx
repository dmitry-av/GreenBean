import { Link, useParams } from "react-router-dom";
import { useSearchArtistsQuery } from "../../services/albumsApi";
import { Artist } from "../../models/album";
import { useState } from "react";
import ErrorPage from "../ErrorPage/ErrorPage";
import LoadingIndicator from "../LoadingIndicator";
import genericArtistPic from "../../assets/generic-artist.png";
import "./ArtistSeachResults.css";

const PAGE_SIZE = 100;


function ArtistSearchResults() {
    const { term } = useParams();
    const [page, setPage] = useState<number>(1);
    const { data, error, isSuccess, isLoading, isFetching } = useSearchArtistsQuery(term, { refetchOnMountOrArgChange: true });

    let content;

    if (isLoading || isFetching) {
        content = <LoadingIndicator />;
    }

    if (error) {
        content = <ErrorPage />;
    }
    if (isSuccess) {
        const { artists, count, next, previous } = data!;
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
        const totalPages = Math.ceil(count / PAGE_SIZE);
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

        content = (
            <>
                <h3 className="results-heading">Search results</h3>
                {(previous !== null && next !== null) && pagination}
                {artists.map((artist: Artist) => (
                    <article className="artist-search-card" key={artist.disc_id}>
                        <Link to={`/artists/${artist.disc_id}`} className="album-link">
                            <div className="artist-result-content">
                                <div className="artist-image-container">
                                    <img
                                        src={(artist.cover || artist.cover_ext_url) ?? genericArtistPic}
                                        alt={genericArtistPic}
                                        className="artist-image"
                                    />
                                </div>
                                <div className="artist-details">
                                    <span className="artist-title">{artist.name}</span>
                                </div>
                            </div>
                        </Link>
                    </article>
                ))
                }
                {(previous !== null && next !== null) && pagination}
            </>
        );
    }

    return (
        <section className="artist-search-results">
            {content}
        </section>
    );
};

export default ArtistSearchResults;