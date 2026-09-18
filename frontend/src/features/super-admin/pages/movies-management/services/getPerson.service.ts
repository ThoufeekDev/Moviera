import api from "../../../../../api/axios";

export interface Person{
    id: string;
    name: string;
    imageUrl: string | null;
}

interface GetPersonResponse {
    message: string;
    data:Person[]
}
export const getPerson = async ():Promise<Person[]> => {
    const response = await api.get<GetPersonResponse>('/persons');

    return response.data.data
}