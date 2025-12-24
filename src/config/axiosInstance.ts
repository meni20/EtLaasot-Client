import axios from "axios"

export const createAxiosInstance = (
    baseURL: string,
    prefix: string = "",
    headers: Record<string, string> = {}
) => {
    const instance = axios.create({
        headers,
        baseURL: baseURL + "/api" + prefix
    })
    return instance
}