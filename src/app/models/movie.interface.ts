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
}

export interface Row {
    genre: string;
    movies: Movie[] | [];
}