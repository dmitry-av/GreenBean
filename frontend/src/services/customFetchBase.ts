import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import store, { RootState } from '../store';
import { Mutex } from 'async-mutex';
import { setAuthTokens, setLogout } from '../store/slices/authSlice';
import axios from 'axios';



interface RefreshResponse {
    access: string;
    refresh: string;
}

const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        // if we have a token set in state, let's assume that we should be passing it.
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    // wait until the mutex is available without locking it
    await mutex.waitForUnlock();

    // retrieve the refresh token from your Redux store
    const refreshToken = store.getState().auth.refreshToken;

    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        // checking whether the mutex is locked
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            try {
                const refreshResult = await axios
                    .post(
                        '/jwt/refresh/',
                        {
                            refresh: refreshToken,
                        },
                        {
                            baseURL: import.meta.env.VITE_API_URL
                        }
                    );
                if ((refreshResult.status === 200) && refreshResult.data) {
                    const { access, refresh } = refreshResult.data as RefreshResponse;
                    api.dispatch(
                        setAuthTokens({
                            token: access,
                            refreshToken: refresh,
                        })
                    );
                    // retry the initial query
                    result = await baseQuery(args, api, extraOptions);
                } else {
                    api.dispatch(setLogout());
                    window.location.replace('/login');
                }
            } catch (e) {
                console.log(e, "Error during token refresh attempt");
                api.dispatch(setLogout());
                window.location.replace('/login');
            } finally {
                // release must be called once the mutex should be released again.
                release();
            }
        } else {
            // wait until the mutex is available without locking it
            await mutex.waitForUnlock();
            result = await baseQuery(args, api, extraOptions);
        }
    }
    return result;
};

export default baseQueryWithReauth;