import { getErrorMessage } from '@/utils/helpers';

describe('getErrorMessage', () => {
    it('should return error message when error is instance of Error', () => {
        const error = new Error('Test error message');
        const result = getErrorMessage(error);

        expect(result).toBe('Test error message');
    });

    it('should return string representation when error is not instance of Error', () => {
        const error = 'String error';
        const result = getErrorMessage(error);

        expect(result).toBe('String error');
    });

    it('should convert number to string', () => {
        const error = 404;
        const result = getErrorMessage(error);

        expect(result).toBe('404');
    });

    it('should convert object to string', () => {
        const error = { code: 500, message: 'Server error' };
        const result = getErrorMessage(error);

        expect(result).toBe('[object Object]');
    });

    it('should handle null', () => {
        const error = null;
        const result = getErrorMessage(error);

        expect(result).toBe('null');
    });

    it('should handle undefined', () => {
        const error = undefined;
        const result = getErrorMessage(error);

        expect(result).toBe('undefined');
    });
});