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
        message: "No content",
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
    TASK_NOT_FOUND: "Task not found",
    USER_NOT_FOUND: "User not found",
    INVALID_TASK_ID: "Invalid task ID",
    TASK_COMPLETED: "Task completed successfully",
}
