import type { Theatre } from "../entities/theatre.entity";


export interface TheatreWithCity{
    theatre: Theatre,
    city: {
        id: string;
        name: string;
        state: string;
        country: string;
        slug: string;
        isActive:boolean
    }
}