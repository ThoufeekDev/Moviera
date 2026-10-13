import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

// apis
import { getPersons, type Person } from "../api/getPersons.api";
import { createPerson, type createPersonData } from "../api/createPerson.api";

export const usePersons = () => {
    return useQuery({
        queryKey: ["persons"],
        queryFn: getPersons,
        staleTime: 1000 * 60 * 15,
    });
};


export const useCreatePerson = () => {
    // This gives us access to the same QueryClient that we configured in main.tsx.
    // it remembers the cached results
    const queryClient =  useQueryClient();
    return useMutation({
        // This is the function TanStack Query executes when we actually want to create someone.
        mutationFn: (data: createPersonData) => createPerson(data),
        // Runs after succesful creation
        onSuccess: (person) => {
            queryClient.setQueryData<Person[]>(
                ['persons'],
                (currentPersons = []) => [
                    ...currentPersons,
                    person,
                ]
            )
        }
        
    })
}