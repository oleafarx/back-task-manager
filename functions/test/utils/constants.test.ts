import { Message, Constants } from '@/utils/contants';

describe('Message Utilities', () => {
    describe('_200_OPERATION_SUCCESSFUL', () => {
        it('should return success response with data and custom message', () => {
            const data = { id: 1 };
            const message = 'Custom success';
            const result = Message._200_OPERATION_SUCCESSFUL(data, message);

            expect(result).toEqual({
                status: 200,
                message: 'Custom success',
                data: { id: 1 }
            });
        });

        it('should return success response with default message', () => {
            const data = { id: 1 };
            const result = Message._200_OPERATION_SUCCESSFUL(data);

            expect(result).toEqual({
                status: 200,
                message: 'Operation successful',
                data: { id: 1 }
            });
        });

        it('should return success response without data', () => {
            const result = Message._200_OPERATION_SUCCESSFUL();

            expect(result).toEqual({
                status: 200,
                message: 'Operation successful',
                data: undefined
            });
        });
    });

    describe('_201_CREATED', () => {
        it('should return created response with data', () => {
            const data = { id: 1, name: 'Test' };
            const result = Message._201_CREATED(data);

            expect(result).toEqual({
                status: 201,
                message: 'Resource created successfully',
                data: { id: 1, name: 'Test' }
            });
        });
    });

    describe('_204_NO_CONTENT', () => {
        it('should return no content response with default message', () => {
            const result = Message._204_NO_CONTENT();

            expect(result).toEqual({
                status: 204,
                message: 'Operation successful, no content'
            });
        });
    });

    describe('_404_NOT_FOUND', () => {
        it('should return not found response with message', () => {
            const result = Message._404_NOT_FOUND('Resource not found');

            expect(result).toEqual({
                status: 404,
                message: 'Resource not found'
            });
        });
    });

    describe('_409_CONFLICT', () => {
        it('should return conflict response with message', () => {
            const result = Message._409_CONFLICT('Data conflict');

            expect(result).toEqual({
                status: 409,
                message: 'Data conflict'
            });
        });
    });

    describe('_500_INTERNAL_SERVER_ERROR', () => {
        it('should return internal server error response', () => {
            const result = Message._500_INTERNAL_SERVER_ERROR('Database error');

            expect(result).toEqual({
                status: 500,
                message: 'Internal server error',
                error: 'Database error'
            });
        });
    });
});

describe('Constants', () => {
    it('should have all required constants defined', () => {
        expect(Constants.TASK_NOT_FOUND).toBe('No tasks found for this user');
        expect(Constants.USER_NOT_FOUND).toBe('User not found');
        expect(Constants.INVALID_TASK_ID).toBe('Invalid task ID');
        expect(Constants.TASK_COMPLETED).toBe('Task completed successfully');
    });
});