import axios, { AxiosInstance } from "axios";
import config from "../config";
import { GenresResponse, GenresRequestParams } from "../interfaces/Genres";
import { GamesResponse, GamesRequestParams, GameExpanded } from "../interfaces/Games";



interface ApiInterface {
    axiosInstance: AxiosInstance;
}

class Api implements ApiInterface {
    axiosInstance = axios.create({
        baseURL: config.baseURL,
        params: { key: config.apiKey }
    })


    getGames(params: GenresRequestParams = {}) {
        return this.axiosInstance.get<GamesResponse>('games', { params });
    }

    getGenres(params: GamesRequestParams = {}) {
        return this.axiosInstance.get<GenresResponse>('genres', { params });
    }

    getGameDetails(id: number) {
        return this.axiosInstance.get<GameExpanded>(`games/${id}`);
    }
}
const api = new Api();

export default api;