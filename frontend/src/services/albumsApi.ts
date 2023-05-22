import { createApi } from '@reduxjs/toolkit/query/react';
import { Album, AlbumDetail, Review, Artist, AddReview, NewFav, UpdateReview } from '../models/album';
import baseQueryWithReauth from './customFetchBase';

interface AlbumsResponse {
    results: Album[];
    count: number;
    next: string | null;
    previous: string | null;
}

export const albumsApi = createApi({
    reducerPath: 'albumsApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Albums', 'Reviews', 'Artists'],
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
                        ...response.albums.map(({ id }) => ({ type: 'Albums', id } as const)),
                        { type: 'Albums', id: 'LIST' },
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Albums', id: 'LIST' }` is invalidated
                    [{ type: 'Albums', id: 'LIST' }],

        }),
        getFavoriteAlbums: builder.query<Album[], void>({
            query: () => `/albums/favorites/`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Albums' as const, id })),
                        { type: 'Albums', id: 'LIST' },
                    ]
                    : [{ type: 'Albums', id: 'LIST' }],
        }),
        getAlbumDetail: builder.query<AlbumDetail, string>({
            query: (disc_id) => `/albums/${disc_id}`,
            providesTags: (result, error, id) => [
                { type: 'Albums', id } as const,
            ]

        }),
        getRelatedAlbums: builder.query<Album[], string>({
            query: (disc_id) => `artists/${disc_id}/related-albums/`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Albums' as const, id })),
                        { type: 'Albums', id: 'LIST' },
                    ]
                    : [{ type: 'Albums', id: 'LIST' }],
        }),
        getFavoriteArtists: builder.query<Artist[], void>({
            query: () => `/artists/favorites/`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Artists' as const, id })),
                        { type: 'Artists', id: 'LIST' },
                    ]
                    : [{ type: 'Artists', id: 'LIST' }],
        }),
        searchAlbums: builder.query({
            query: (term) => `/albums/search/?term=${term}`,
            transformResponse: (response: AlbumsResponse) => {
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
            providesTags: (result, error, id) => [
                { type: 'Reviews', id } as const,
            ]
        }),
        getArtistDetail: builder.query<Artist, string>({
            query: (disc_id) => `/artists/${disc_id}`,
            providesTags: (result, error, id) => [
                { type: 'Artists', id } as const,
            ]
        }),
        addReview: builder.mutation<Review, AddReview>({
            query(body) {
                return {
                    url: '/reviews/',
                    method: 'POST',
                    body,
                };
            },
            invalidatesTags: [{ type: 'Albums' }],
        }),
        delReview: builder.mutation({
            query(id) {
                return {
                    url: `/reviews/${id}/`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: [{ type: 'Albums' }, { type: 'Reviews' }],
        }),
        updateReview: builder.mutation<Review, UpdateReview>({
            query({ id, body }) {
                return {
                    url: `/reviews/${id}/`,
                    method: 'PUT',
                    body
                };
            },
            invalidatesTags: [{ type: 'Reviews' }],
        }),
        addToFav: builder.mutation<NewFav, { disc_id: string; model: string; }>({
            query({ disc_id, model }) {
                return {
                    url: `/${model}/favorite/`,
                    method: 'POST',
                    body: {
                        "disc_id": disc_id
                    }
                };
            },
            invalidatesTags: [{ type: 'Albums' }, { type: 'Artists' }]
        }),
        delFromFav: builder.mutation<NewFav, { disc_id: string; model: string; }>({
            query({ disc_id, model }) {
                return {
                    url: `/${model}/delete-favorite/`,
                    method: 'DELETE',
                    body: {
                        "disc_id": disc_id
                    }
                };
            },
            invalidatesTags: [{ type: 'Albums' }, { type: 'Artists' }],
        }),
    }),
});

export const {
    useGetAlbumsQuery,
    useGetAlbumDetailQuery,
    useSearchAlbumsQuery,
    useGetReviewDetailQuery,
    useGetArtistDetailQuery,
    useAddReviewMutation,
    useDelFromFavMutation,
    useAddToFavMutation,
    useDelReviewMutation,
    useUpdateReviewMutation,
    useGetFavoriteAlbumsQuery,
    useGetFavoriteArtistsQuery,
    useGetRelatedAlbumsQuery } = albumsApi;