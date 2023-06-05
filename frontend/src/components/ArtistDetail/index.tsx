import { useNavigate, useParams } from 'react-router-dom';
import { useGetArtistDetailQuery } from '../../services/albumsApi';
import FavAlbum from '../FavAlbum';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import ArtistRelatedAlbums from '../ArtistRelatedAlbums';
import LoadingIndicator from '../LoadingIndicator';


function ArtistDetailPage() {
    const auth = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const { disc_id } = useParams();
    const { data, isLoading, error, isFetching, isSuccess } = useGetArtistDetailQuery(disc_id!, { refetchOnMountOrArgChange: true });
    const artist = data!;

    let content;

    if (isSuccess) {
        content = <div>
            <h2>{artist.name}</h2>
            {auth.account && <FavAlbum disc_id={artist.disc_id} is_favorite={artist.is_favorite} model="artists" />}
            <h4>Likes: {artist.favorites}</h4>
            {artist.cover ?
                <img src={artist.cover} alt={artist.name} style={{ height: '400px' }} className="img-thumbnail" /> : <p></p>}
            <p>{artist.description}</p>
            <button onClick={() => navigate(-1)}>Go back</button>
            <div>
                <ArtistRelatedAlbums disc_id={artist.disc_id} />
            </div>
        </div>;
    }

    if (error) {
        content = <p>An error occured</p>;
    }


    return (
        <div>{(isLoading || isFetching) ? <LoadingIndicator /> : content}</div>
    );
};

export default ArtistDetailPage;