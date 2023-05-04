// import axios from "axios";
import { Album } from "../models/album";
import axiosService from "./axios";


class musicService {
    async getAlbums(pageNumber: number) {
        const response = await axiosService.get<Album[]>(`/albums/?page=${pageNumber}`);
        return response.data;
    }

    // async getAlbumById(disc_id: string) {
    //     const response = await axiosService.get<DetailAlbum>(`/albums/${disc_id}`);
    //     return response.data;
    // }

    async addAlbum(title: string) {
        const response = await axiosService.post<Album>('/albums/', { title });
        return response.data;
    }

    async removeAlbum(disc_id: string) {
        const response = await axiosService.delete('/albums/' + disc_id);
        return response.data;
    }
}

export default new musicService();