export interface Platform {
    id: number;
    name: string;
    slug: string;
}

export interface PlatformExtended extends Platform {
    released_at: string;
    requirements: Requirements
}

export interface Requirements {
    minimum: string;
    recommended: string;
}

export interface PlatformWrapper {
    platform: PlatformExtended;
}

export interface Store {
    id: number;
    name: string;
    slug: string;
}

export interface StoreWrapper {
    store: Store;
}

export interface Rating {
    id: number;
    title: string;
    count: number;
    percent: number;
}

export interface AddedByStatus {
    yet: number;
    owned: number;
    beaten: number;
    toplay: number;
    dropped: number;
    playing: number;
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
    language: string;
    games_count: number;
    image_background: string;
}

export interface ShortScreenshot {
    id: number;
    image: string;
}

export interface ParentPlatform {
    platform: Platform;
}

export interface Genre {
    id: number;
    name: string;
    slug: string;
}

export interface GameModel {
    slug: string;
    name: string;
    playtime: number;
    platforms: PlatformWrapper[];
    stores: StoreWrapper[];
    released: string;
    tba: boolean;
    background_image: string;
    rating: number;
    rating_top: number;
    ratings: Rating[];
    ratings_count: number;
    reviews_text_count: number;
    added: number;
    added_by_status: AddedByStatus;
    metacritic?: number;
    suggestions_count: number;
    updated: Date;
    id: number;
    score?: any;
    clip?: any;
    tags: Tag[];
    user_game?: any;
    reviews_count: number;
    saturated_color: string;
    dominant_color: string;
    short_screenshots: ShortScreenshot[];
    parent_platforms: ParentPlatform[];
    genres: Genre[];
}


export interface GameExpanded extends GameModel {
    name_original: string;
    description: string;
    metacritic_platforms: MetacriticPlatform[];
    background_image_additional: string;
    website: string;
    reactions: Reactions;
    screenshots_count: number;
    movies_count: number;
    creators_count: number;
    achievements_count: number;
    parent_achievements_count: number;
    reddit_url: string;
    reddit_name: string;
    reddit_description: string;
    reddit_logo: string;
    reddit_count: number;
    twitch_count: number;
    youtube_count: number;
    alternative_names: string[];
    metacritic_url: string;
    parents_count: number;
    additions_count: number;
    game_series_count: number;
    developers: Developer[];
    publishers: Publisher[];
    esrb_rating: EsrbRating;
    description_raw: string;
}

export interface MetacriticPlatform {
    metascore: number;
    url: string;
    platform: Platform;
}

export interface Reactions {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
    8: number;
    9: number;
    10: number;
    11: number;
    12: number;
    13: number;
    14: number;
    15: number;
    16: number;
    20: number;
    21: number;
}

export interface Developer {
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string;
}

export interface Publisher {
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string;
}

export interface EsrbRating {
    id: number;
    name: string;
    slug: string;
}

export interface GamesResponse {
    count: number;
    next?: string;
    previous?: string;
    results: GameModel[];
    user_platforms: boolean;
}

export interface GamesRequestParams {
    page?: number
    page_size?: number
    search?: string
    search_precise?: boolean
    search_exact?: boolean
    parent_platforms?: string
    platforms?: string
    stores?: string
    developers?: string
    publishers?: string
    genres?: string
    tags?: string
    creators?: string
    dates?: string
    updated?: string
    platforms_count?: number
    metacritic?: string
    exclude_collection?: number
    exclude_additions?: boolean
    exclude_parents?: boolean
    exclude_game_series?: boolean
    ordering?: string
}