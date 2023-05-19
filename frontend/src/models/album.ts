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
    rating: number;
    album: AlbumDetail;
}

export interface AddReview {
    album: number;
    text: string;
    rating: number;
}

export type UpdateReview = {
    id: number;
    body: AddReview;
};

export interface Artist {
    id: number;
    disc_id: string;
    name: string;
    cover: string | null;
    description: string;
}

export interface NewFav {
    disc_id: string;
    is_favorite: boolean;
    model: string;
};

export interface AlbumDetail extends Album {
    genres: string[];
    avg_rating: number | null;
    artists: { disc_id: string; name: string; }[];
    tracks: { position: number; title: string; duration: string; }[];
    reviews: Review[];
    cover: string | null;
    notes: string | null;
    is_favorite: boolean;
    is_full_record: boolean;
    favorites: number;
}