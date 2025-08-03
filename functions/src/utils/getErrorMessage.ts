import { log } from "firebase-functions/logger";

export const getErrorMessage = (error: any): string => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log('Error occurred:', errorMessage);
    return errorMessage
}