import { HttpResponse } from "./HttpTypes";


export const ok = <T>(data: T, message?: string,): HttpResponse<T> => ({
    status: 200,
    body: {
        message,
        data,
    }
})


export const created = <T>(data?: T, message?: string): HttpResponse<T> => ({
    status: 201,
    body: {
        message,
        data,
    }
})