

import type { TheatreOverviewFacility } from "./theatreOverviewFacility.types";
import type { Theatre } from "./theatre.types";
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