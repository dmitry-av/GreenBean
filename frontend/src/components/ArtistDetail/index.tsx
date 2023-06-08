import { useNavigate, useParams } from 'react-router-dom';
import { useGetArtistDetailQuery } from '../../services/albumsApi';
import FavAlbum from '../FavAlbum';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import ArtistRelatedAlbums from '../ArtistRelatedAlbums';
import LoadingIndicator from '../LoadingIndicator';
import ErrorPage from '../ErrorPage/ErrorPage';
import genericArtistPic from "../../assets/generic-artist.png";
import "./ArtistDetail.css";
import { AiOutlineRollback } from 'react-icons/ai';


function ArtistDetailPage() {
    const auth = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const { disc_id } = useParams();
    const { data, isLoading, error, isSuccess } = useGetArtistDetailQuery(disc_id!, { refetchOnMountOrArgChange: true });
    const artist = data!;

    let content;

    if (isSuccess) {
        content = (
            <div className='artist-detail'>
                <div className='artist-detail-name'>{artist.name}<span className="like-block"><FavAlbum disc_id={artist.disc_id} is_favorite={artist.is_favorite} model="artists" /><span>{artist.favorites}</span></span></div>
                <img src={(artist.cover || artist.cover_ext_url) ?? genericArtistPic} alt={genericArtistPic} className="artist-detail-cover" />
                <p className='artist-detail-description'>{artist.description}</p>
                <div>
                    <AiOutlineRollback onClick={() => navigate(-1)} size={25} className="artist-detail__back-button" />
                </div>
                <div className='related-albums-section'>
                    <ArtistRelatedAlbums disc_id={artist.disc_id} />
                </div>
            </div>
        );
    }

    if (error) {
        content = <ErrorPage />;
    }


    return (
        <div>{(isLoading) ? <LoadingIndicator /> : content}</div>
    );
};

export default ArtistDetailPage;