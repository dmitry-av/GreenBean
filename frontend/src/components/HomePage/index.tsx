import { useGetRandomAlbumsQuery } from "../../services/albumsApi";
import { Album } from "../../models/album";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import searchSpinner from '../../assets/Spinner-1s-200px.gif';
import { useState } from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import genericAlbumPic from "../../assets/generic-album.jpeg";
import "./HomePage.css";


function RandomList() {
    const pageSize = 12; // Number of albums per page
    const [currentPage, setCurrentPage] = useState(1);
    const [slideDirection, setSlideDirection] = useState("");
    const { data: albums, error, isLoading, isFetching, isSuccess } = useGetRandomAlbumsQuery({ refetchOnMountOrArgChange: true });

    let content;

    if (isLoading || isFetching) {
        return (
            <img
                src={searchSpinner}
                alt="loading"
                height="75"
                className="search-loader"
            />
        );
    }

    if (error) {
        if ('status' in error) {
            content = 'error' in error ? error.error : JSON.stringify(error.data);
            toast.error(content);
        } else {
            content = error.message;
            toast.error(error.message);
        }
    }

    if (isSuccess) {
        const totalPages = Math.ceil(albums.length / pageSize);

        const handleNextPage = () => {
            setCurrentPage((prevPage) => (prevPage === totalPages ? 1 : prevPage + 1));
            setSlideDirection("slide-next");
        };

        const handlePreviousPage = () => {
            setCurrentPage((prevPage) => (prevPage === 1 ? totalPages : prevPage - 1));
            setSlideDirection("slide-previous");
        };
        const getPageAlbums = () => {
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            return albums.slice(startIndex, endIndex);
        };
        const pageAlbums = getPageAlbums();
        content = (
            <div>
                <h2 className="home-title">Explore musical releases and share your musical preferences</h2>
                <div className="pagination-buttons">
                    <FaArrowAltCircleLeft className="direction-icon" onClick={handlePreviousPage} size={35} />
                    <FaArrowAltCircleRight className="direction-icon" onClick={handleNextPage} size={35} />
                </div>
                <div className={`album-grid-ran ${slideDirection}`}>
                    {pageAlbums.map((album: Album, index: number) => (
                        <article className={`album-card fade-in ${index < pageSize ? '' : 'hidden'}`} key={album.disc_id}>
                            <Link to={`/albums/${album.disc_id}`}>
                                <img
                                    src={(album.cover || album.cover_ext_url) ?? genericAlbumPic}
                                    alt={genericAlbumPic}
                                    width="95"
                                    height="95"
                                    className="album-image"
                                />
                                <h3 className="album-title">{album.title}<span className="p-2 album-year">{album.year}</span></h3>
                            </Link>
                        </article>
                    ))}

                </div>
                <div className="pagination-buttons">
                    <FaArrowAltCircleLeft className="direction-icon" onClick={handlePreviousPage} size={35} />
                    <FaArrowAltCircleRight className="direction-icon" onClick={handleNextPage} size={35} />
                    {/* <button onClick={handlePreviousPage}>Previous</button>
                    <button onClick={handleNextPage}>Next</button> */}
                </div>
            </div>
        );
    }

    return (
        <section className="albums-list">

            {content}
        </section>
    );
}

export default RandomList;