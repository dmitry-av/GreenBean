import { Album } from "../../models/album";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import musicService from "../../services/music";
import { RootState } from "..";


type State = {
    items: Album[],
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null;
};

const initialState: State = {
    items: [],
    status: 'idle',
    error: null
};

export const fetchAlbums = createAsyncThunk('albums/fetchAlbums', async () => {
    const albums = await musicService.getAlbums();
    return albums;
});

const albumsSlice = createSlice({
    name: "albums",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAlbums.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(fetchAlbums.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.items = action.payload;
        });
        builder.addCase(fetchAlbums.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error?.message ?? null;
        });
    }
});


export default albumsSlice;

export const selectAllAlbums = (state: RootState) => state.albums.items;

export const selectAlbumById = (state: RootState, albumId: string) =>
    state.albums.items.find(album => album.disc_id === albumId);
