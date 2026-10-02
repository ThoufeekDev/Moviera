

import type { TheatreOverviewFacility } from "./theatreOverviewFacility.type";
import type { Theatre } from "./theatre.type";
export interface TheatreOverview {
  
    theatre: Theatre,
    
    statistics: {
        totalScreens: number,
        totalSeats: number,
        totalShows: number,
    };

    facilities:TheatreOverviewFacility[],

    reviews: {
        averageRating: number,
        totalReviews:number,
    }
}