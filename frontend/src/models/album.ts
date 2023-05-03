export interface Album {
    disc_id: string;
    title: string;
    year: number;
}

export interface DetailAlbum {
    disc_id: string;
    title: string;
    year: number;
}

interface PaginatedAlbums {
    count: number;
    next: string | null;
    previous: string | null;
    results: Album[];
}