import api from "@/shared/lib/axios";


export interface Language{
    id: string;
    name: string;
    code: string
    
}

export const getLanguages = async (): Promise<Language[]> => {
    const response = await api.get('/language');
    return response.data.data
}