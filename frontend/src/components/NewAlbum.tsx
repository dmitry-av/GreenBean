import { useState } from "react";

interface NewAlbumProps {
    onAddAlbum: (title: string) => void;
}

function NewAlbum({ onAddAlbum }: NewAlbumProps): JSX.Element {
    const [title, setTitle] = useState('');
    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;
        onAddAlbum(title);
        setTitle('');
    };
    return (
        <form onSubmit={submitForm}>
            <label htmlFor="title"></label>
            <input value={title} onChange={e => setTitle(e.target.value)} id="title" type="text" className="form-control" />
            <button type="submit" className="btn btn-primary my-3 rounded-pill">Add Album</button>
        </form>
    );
}

export default NewAlbum;