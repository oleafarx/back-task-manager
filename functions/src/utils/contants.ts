require("dotenv").config();

export const Message = {
    _200_OPERATION_SUCCESSFUL: (data?: any, message?: string) => ({
        status: 200,
        message: message || "Operation successful",
        data
    }),
    _201_CREATED: (data: any) => ({
        status: 201,
        message: "Resource created successfully",
        data
    }),
    _204_NO_CONTENT: () => ({
        status: 204,
        message: "Operation successful, no content",
    }),
    _400_BAD_REQUEST: (message: string) => ({
        status: 400,
        message: message || 'Bad request'
    }),
    _401_UNAUTHORIZED: (message: string) => ({
        status: 401,
        message: message || 'Not authorized'
    }),
    _404_NOT_FOUND: (message: string) => ({
        status: 404,
        message: message || "Resource not found",
    }),
    _409_CONFLICT: (message: string) => ({
        status: 409,                
        message: message || "Conflict",
    }),
    _500_INTERNAL_SERVER_ERROR: (message: string) => ({
        status: 500,
        message: "Internal server error",
        error: message
    })
}

export const Constants = {
    TASK_NOT_FOUND: "No tasks found for this user",
    USER_NOT_FOUND: "User not found",
    INVALID_TASK_ID: "Invalid task ID",
    TASK_COMPLETED: "Task completed successfully",
}

export abstract class ParameterStore {
    static readonly accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'your-secret-key';
    static readonly refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
}
