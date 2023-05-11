import { useNavigate, useParams } from 'react-router-dom';
import { useGetArtistDetailQuery } from '../services/albumsApi';
import { toast } from 'react-toastify';


function ArtistDetailPage() {

    const navigate = useNavigate();
    const { disc_id } = useParams();
    const { data, error, isLoading } = useGetArtistDetailQuery(disc_id!);

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
    const artist = data!;

    return (
        <div>
            <h2>{artist.name}</h2>
            {artist.cover ?
                <img src={artist.cover} alt={artist.name} style={{ height: '400px' }} className="img-thumbnail" /> : <p></p>}
            <p>{artist.description}</p>
            <button onClick={() => navigate(-1)}>Go back</button>
        </div>
    );
};

export default ArtistDetailPage;