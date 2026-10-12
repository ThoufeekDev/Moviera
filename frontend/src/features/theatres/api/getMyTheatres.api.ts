import type { Theatre } from "../types/theatre.types";
import api from "@/shared/lib/axios";

interface GetMyTheatresResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Theatre[];
}

export const getMyTheatres = async ():Promise<Theatre[]> => {
     console.log('triggered');
     
    const respone = await api.get<GetMyTheatresResponse>('/theatres/my-theatres');
     console.log('response is ',respone.data.data)
    return respone.data.data
}