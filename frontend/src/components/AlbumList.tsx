import Album from '../models/album';

interface AlbumListProps {
    items: Album[];
    onRemoveAlbum: (disc_id: string) => void;
}

function AlbumList({ items, onRemoveAlbum }: AlbumListProps) {
    return (
        <ul className='list-group'>
            {items.map(item => <li className='list-group-item' key={item.disc_id}>{item.title} - {item.year}
                <button onClick={() => onRemoveAlbum(item.disc_id)} className="btn btn-outline-danger mx-2 rounded-pill">Delete</button></li>)}
        </ul>
    );
}

export default AlbumList;