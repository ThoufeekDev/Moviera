import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

// apis
import { getPerson ,type Person } from "../services/getPerson.service";
import { createPerson,type createPersonData, } from "../services/createPerson.service";

export const usePersons = () => {
    return useQuery({
        // This uniquely identifies this query.
        // Think of it as the name of the cache.
        queryKey: ["persons"],
        // queryfn use when you need the persons data, execute getPersons()
        queryFn:getPerson
    })
}


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