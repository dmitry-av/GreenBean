import { useGetRandomAlbumsQuery } from "../../services/albumsApi";
import { Album } from "../../models/album";
import { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import searchLoader from '../../assets/loader.gif';
import "./HomePage.css";

const PAGE_SIZE = 100;

function RandomList() {
    const [page, setPage] = useState<number>(1);
    const { data, error, isLoading } = useGetRandomAlbumsQuery(page, { refetchOnMountOrArgChange: true });

    const observer = useRef<IntersectionObserver | null>(null);
    const lastAlbumRef = useRef<HTMLDivElement | null>(null);
    const [albums, setAlbums] = useState<Album[]>([]);

    useEffect(() => {
        if (isLoading || error || !data) return;

        setAlbums((prevAlbums) => [...prevAlbums, ...data.albums]);
    }, [data, isLoading, error]);

    useEffect(() => {
        if (isLoading || error || !data) return;

        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
        };

        const handleObserver: IntersectionObserverCallback = (entries) => {
            const target = entries[0];
            if (target.isIntersecting && data.next) {
                setPage((prevPage) => prevPage + 1);
            }
        };

        observer.current = new IntersectionObserver(handleObserver, options);

        if (lastAlbumRef.current) {
            observer.current.observe(lastAlbumRef.current);
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [data, isLoading, error]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        if ('status' in error) {
            const errMsg = 'error' in error ? error.error : JSON.stringify(error.data);
            toast.error(errMsg);
        } else {
            toast.error(error.message);
        }
    }

    if (!data) {
        return <div>Data is unavailable</div>;
    }

    const { count, next, previous } = data;
    const totalPages = Math.ceil(count / PAGE_SIZE);

    const renderedAlbums = albums.map((album: Album, index: number) => {
        if (index === albums.length - 1) {
            return (
                <article className="album-card" key={album.disc_id} ref={lastAlbumRef}>
                    <Link to={`/albums/${album.disc_id}`}>
                        <img
                            src={album.cover_ext_url}
                            alt={album.title}
                            width="95"
                            height="95"
                            className="album-image"
                        />
                        <h3 className="album-title">{album.title}<span className="p-2 album-year">{album.year}</span></h3>

                    </Link>
                </article>
            );
        } else {
            return (
                <article className="album-card" key={album.disc_id}>
                    <Link to={`/albums/${album.disc_id}`}>
                        <img
                            src={album.cover_ext_url}
                            alt={album.title}
                            width="95"
                            height="95"
                            className="album-image"
                        />
                        <h3 className="album-title">{album.title}<span className="p-2 album-year">{album.year}</span></h3>

                    </Link>
                </article>
            );
        }
    });

    return (
        <section className="albums-list">
            <div className="album-grid-ran">
                {renderedAlbums}
            </div>
            {(isLoading) && <img
                src={searchLoader}
                alt="search-loader"
                height="75"
                className="loader-image"
            />}
        </section>
    );
};

export default RandomList;