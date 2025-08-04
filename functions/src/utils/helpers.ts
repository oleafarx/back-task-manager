import { log } from "firebase-functions/logger";

export const getErrorMessage = (error: any): string => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log('Error occurred:', errorMessage);
    return errorMessage
}

export const convertDate = (seconds: any, nanoseconds: any): any => {
    return seconds * 1000 + Math.floor(nanoseconds / 1e6)
}