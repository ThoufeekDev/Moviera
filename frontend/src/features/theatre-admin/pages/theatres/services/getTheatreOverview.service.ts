import api from "../../../../../api/axios";
import type { TheatreOverview } from "../types/theatreOverview";
interface GetTheatreOverviewResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: TheatreOverview;
}


export const getOverview = async (theatreId:string):Promise<TheatreOverview> => {
    const response = await api.get<GetTheatreOverviewResponse>(`theatres/${theatreId}`);

   return response.data.data
}