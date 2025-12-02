// Centralizes all API request logic to avoid repetition
import { fetchBaseQuery, type BaseQueryApi, type FetchArgs } from "@reduxjs/toolkit/query";
import { startLoading, stopLoading } from "../layout/uiSlice";
import { toast } from "react-toastify";
import { router } from "../routes/Routes";

// Setup base query
const customBaseQuery = fetchBaseQuery({
    baseUrl: 'https://localhost:5001/api',
    credentials: 'include' //Include cookies with each request
});

type ErrorResponse = | string | { title: string } | { errors: string[] }

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000)); // Delay of 1000 miliseconds to see loading UI clearly

// Error handling wrapper: Wraps every api request with start/stop loading actions
export const baseQueryWithErrorHandling = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object) => {
    //start loading
    api.dispatch(startLoading());
    if (import.meta.env.DEV) await sleep();
    const result = await customBaseQuery(args, api, extraOptions);
    //stop loading
    api.dispatch(stopLoading());
    // Handling different error response from toast messages to redirect to another page
    if (result.error) {
        const originalStatus = result.error.status === 'PARSING_ERROR' && result.error.originalStatus
            ? result.error.originalStatus : result.error.status

        const responseData = result.error.data as ErrorResponse;
        switch (originalStatus) {
            case 400:
                if (typeof responseData === 'string') toast.error(responseData);
                else if ('errors' in responseData) {
                    throw Object.values(responseData.errors).flat().join(', ')
                }
                else toast.error(responseData.title)
                break;
            case 401:
                if (typeof responseData === 'object' && 'title' in responseData)
                    toast.error(responseData.title);
                break;
            case 403:// A user does a forbidden action
                if (typeof responseData === 'object')
                    toast.error('403 Forbidden');
                break;
            case 404:
                if (typeof responseData === 'object' && 'title' in responseData)
                    router.navigate('/not-found')
                break;
            case 500:
                if (typeof responseData === 'object')
                    router.navigate('/server-error', { state: { error: responseData } })
                break;
            default:
                break;
        }
    }
    return result;
}