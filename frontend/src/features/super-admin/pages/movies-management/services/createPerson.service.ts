import api from "../../../../../api/axios";

export interface createPersonData {
    name: string;
    image?: File;
}

export interface Person{
    id: string;
    name: string;
    imageUrl:string | null
}

interface CreatePersonResponse {
  message: string;
  data: Person;
}


export const createPerson = async (data:createPersonData):Promise<Person> => {
    const formData = new FormData();

    formData.append('name', data.name);
    if (data.image) formData.append('image', data.image);

    const response = await api.post<CreatePersonResponse>('/persons', formData);
    return response.data.data
}