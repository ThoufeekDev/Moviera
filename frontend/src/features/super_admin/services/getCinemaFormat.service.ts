import api from "../../../api/axios";


export interface CinemaFormat {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
}

export const getCinemaFormats = async ():Promise<CinemaFormat[]> => {
    const response = await api.get('/cinema-format');

    return response.data.data
}