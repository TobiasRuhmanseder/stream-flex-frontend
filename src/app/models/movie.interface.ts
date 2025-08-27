import { Genre } from "./genre.interface";

export interface Movie {
    id: number;
    title: string;
    description: string;
    logo: string | null;
    is_hero: boolean;

    video_1080: string | null;
    video_720: string | null;
    video_480: string | null;
    teaser_video: string | null;

    hero_image: string | null;
    thumbnail_image: string | null;

    genres?: Genre[];
    created_at: string;
    is_favorite: boolean;
}

export interface Row {
    genre: string;
    movies: Movie[] | [];
}

export interface ResolveSpeedRequest {
    movieId: number;
    downlink?: number | null;
    screenH?: number | null;
}

export interface ResolveSpeedResponse {
    movie_id: number;
    quality: '1080' | '720' | '480';
    url: string;           // /api/movies/:id/video-stream/?q=...
    message_key: string;   // 'player.quality.1080' ...
}