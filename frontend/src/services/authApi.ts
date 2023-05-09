import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (body) => ({
                url: '/accounts/register/',
                method: 'POST',
                body,
            }),
        }),
        verification: builder.mutation({
            query: (body) => ({
                url: '/accounts/verify-registration/',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useRegisterMutation, useVerificationMutation } = authApi;