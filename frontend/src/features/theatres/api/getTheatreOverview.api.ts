import api from "@/shared/lib/axios";
import type { TheatreOverview } from "../types/theatreOverview.types";
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