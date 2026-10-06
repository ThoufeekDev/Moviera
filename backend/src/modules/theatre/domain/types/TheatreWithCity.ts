import type { Theatre } from "../entities/Theatre";


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