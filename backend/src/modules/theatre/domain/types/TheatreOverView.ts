
import { TheatreOverviewFacility } from "./TheatreOverviewFacility";
import { TheatreWithCity } from "./TheatreWithCity";

export interface TheatreOverview{
    theatre: TheatreWithCity,
    
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