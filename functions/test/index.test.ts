import * as functions from 'firebase-functions';
import app from '@/app';

// Mock firebase-functions
jest.mock('firebase-functions', () => ({
    https: {
        onRequest: jest.fn()
    }
}));

// Mock app
jest.mock('@/app');

describe('Firebase Functions Index', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create firebase function with app', () => {
        const mockOnRequest = jest.fn().mockReturnValue('firebase-function');
        (functions.https.onRequest as jest.Mock) = mockOnRequest;

        // Re-import to trigger function creation
        const indexModule = require('@/index');

        expect(functions.https.onRequest).toHaveBeenCalledWith(app);
        expect(indexModule.api).toBe('firebase-function');
    });
});