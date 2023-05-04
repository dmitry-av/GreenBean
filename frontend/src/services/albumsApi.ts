import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Album, AlbumDetail, Review } from '../models/album';

interface AlbumsResponse {
    results: Album[];
    count: number;
    next: string | null;
    previous: string | null;
}

interface SearchResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Album[];
}

export const albumsApi = createApi({
    reducerPath: 'albumsApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
    endpoints: (builder) => ({
        getAlbums: builder.query({
            query: (page) => `/albums/?page=${page}`,
            transformResponse: (response: AlbumsResponse) => {
                return {
                    albums: response.results,
                    count: response.count,
                    next: response.next,
                    previous: response.previous,
                };
            },
        }),
        getAlbumDetail: builder.query<AlbumDetail, string>({
            query: (disc_id) => `/albums/${disc_id}`,
        }),
        searchAlbums: builder.query({
            query: (term) => `/albums/search/?term=${term}`,
            transformResponse: (response: SearchResponse) => {
                return {
                    albums: response.results,
                    count: response.count,
                    next: response.next,
                    previous: response.previous,
                };
            },
        }),
        getReviewDetail: builder.query<Review, string>({
            query: (id) => `/reviews/${id}`,
        }),
    }),
});

export const { useGetAlbumsQuery, useGetAlbumDetailQuery, useSearchAlbumsQuery, useGetReviewDetailQuery } = albumsApi;