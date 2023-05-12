import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Album, AlbumDetail, Review, Artist, AddReview } from '../models/album';
import { RootState } from '../store';
import baseQueryWithReauth from './customFetchBase';

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
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Albums'],
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
            providesTags: (response) =>
                // is result available?
                response
                    ? // successful query
                    [
                        ...response.albums.map(({ disc_id }) => ({ type: 'Albums', disc_id } as const)),
                        { type: 'Albums', id: 'LIST' },
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{ type: 'Albums', id: 'LIST' }],
        }),
        getAlbumDetail: builder.query<AlbumDetail, string>({
            query: (disc_id) => `/albums/${disc_id}`,
            providesTags: (result, error, disc_id) => [
                { type: 'Albums', id: disc_id } as const,
            ],
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
        getArtistDetail: builder.query<Artist, string>({
            query: (disc_id) => `/artists/${disc_id}`,
        }),
        addReviewMutation: builder.mutation<Review, AddReview>({
            query(body) {
                return {
                    url: '/reviews/',
                    method: 'POST',
                    body,
                };
            },
            invalidatesTags: [{ type: 'Albums' }],
        }),
    }),
});

export const {
    useGetAlbumsQuery,
    useGetAlbumDetailQuery,
    useSearchAlbumsQuery,
    useGetReviewDetailQuery,
    useGetArtistDetailQuery,
    useAddReviewMutationMutation } = albumsApi;