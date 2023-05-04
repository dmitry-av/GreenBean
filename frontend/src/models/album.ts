import { UserResponse } from "./user";

export interface Album {
    id: number;
    disc_id: string;
    title: string;
    year: number;
}

export interface Review {
    id: number;
    creator: UserResponse;
    created_at: string;
    modified_at: string;
    text: string;
    rating: string;
    album: AlbumDetail;
}

export interface AlbumDetail extends Album {
    genres: string[];
    avg_rating: number | null;
    artists: { disc_id: string; name: string; }[];
    tracks: { position: number; title: string; duration: string; }[];
    reviews: Review[];
    cover: string | null;
    notes: string | null;
    is_full_record: boolean;
}