export const getErrorMessage = (error: any): string => {
    return error instanceof Error ? error.message : String(error);
}