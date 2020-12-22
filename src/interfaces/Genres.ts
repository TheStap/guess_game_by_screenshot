export interface Game {
    id: number;
    slug: string;
    name: string;
    added: number;
}

export interface SimpleGenre {
    id: number;
    name: string;
}

export interface Genre extends SimpleGenre {
    slug: string;
    games_count: number;
    image_background: string;
    games: Game[];
}


export interface GenresResponse {
    count: number;
    next?: string;
    previous?: string;
    results: Genre[]
}

export interface GenresRequestParams {
    ordering?: string;
    page?: number;
    page_size?: number;
}