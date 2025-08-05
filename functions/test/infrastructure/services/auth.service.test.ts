import jwt from 'jsonwebtoken';
import { log } from 'firebase-functions/logger';
import { AuthService } from '@/infrastructure/services/auth.service';
import { ParameterStore } from '@/utils/contants';

jest.mock('firebase-functions/logger');
jest.mock('@/utils/contants', () => ({
  ParameterStore: {
    accessTokenSecret: 'test-access-secret',
    refreshTokenSecret: 'test-refresh-secret'
  }
}));

describe('AuthService', () => {
  let authService: AuthService;
  let jwtSignSpy: jest.SpyInstance;
  let jwtVerifySpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    authService = new AuthService();
    jwtSignSpy = jest.spyOn(jwt, 'sign');
    jwtVerifySpy = jest.spyOn(jwt, 'verify');
    logSpy = jest.spyOn(require('firebase-functions/logger'), 'log');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with correct token secrets', () => {
      expect(authService['accessTokenSecret']).toBe('test-access-secret');
      // Nota: Hay un bug en el código original - refreshTokenSecret usa accessTokenSecret
      expect(authService['refreshTokenSecret']).toBe('test-access-secret');
    });
  });

  describe('generateTokenPair', () => {
    it('should generate access and refresh tokens successfully', () => {
      const mockAccessToken = 'mock-access-token';
      const mockRefreshToken = 'mock-refresh-token';
      
      jwtSignSpy
        .mockReturnValueOnce(mockAccessToken)
        .mockReturnValueOnce(mockRefreshToken);

      const result = authService.generateTokenPair('user123', 'test@example.com');

      expect(jwtSignSpy).toHaveBeenCalledTimes(2);
      expect(jwtSignSpy).toHaveBeenNthCalledWith(1, 
        { userId: 'user123', email: 'test@example.com' },
        'test-access-secret',
        { expiresIn: '15m' }
      );
      expect(jwtSignSpy).toHaveBeenNthCalledWith(2,
        { userId: 'user123', email: 'test@example.com' },
        'test-access-secret', // Bug: debería ser refreshTokenSecret
        { expiresIn: '7d' }
      );
      expect(result).toEqual({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken
      });
    });

    it('should throw error when token generation fails', () => {
      const error = new Error('JWT signing failed');
      jwtSignSpy.mockImplementation(() => { throw error; });

      expect(() => {
        authService.generateTokenPair('user123', 'test@example.com');
      }).toThrow('Failed to generate tokens');

      expect(logSpy).toHaveBeenCalledWith('Error generating token pair:', error);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify access token successfully', () => {
      const mockPayload = { userId: 'user123', email: 'test@example.com' };
      jwtVerifySpy.mockReturnValue(mockPayload);

      const result = authService.verifyAccessToken('valid-token');

      expect(jwtVerifySpy).toHaveBeenCalledWith('valid-token', 'test-access-secret');
      expect(result).toEqual(mockPayload);
    });

    it('should throw error for invalid access token', () => {
      jwtVerifySpy.mockImplementation(() => {
        throw new jwt.JsonWebTokenError('Invalid token');
      });

      expect(() => {
        authService.verifyAccessToken('invalid-token');
      }).toThrow('Invalid access token');
    });

    it('should throw error for expired access token', () => {
      jwtVerifySpy.mockImplementation(() => {
        throw new jwt.TokenExpiredError('Token expired', new Date());
      });

      expect(() => {
        authService.verifyAccessToken('expired-token');
      }).toThrow('Invalid access token');
    });

    it('should throw generic error for other verification failures', () => {
      jwtVerifySpy.mockImplementation(() => {
        throw new Error('Unknown error');
      });

      expect(() => {
        authService.verifyAccessToken('token');
      }).toThrow('Token verification failed');
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify refresh token successfully', () => {
      const mockPayload = { userId: 'user123', email: 'test@example.com' };
      jwtVerifySpy.mockReturnValue(mockPayload);

      const result = authService.verifyRefreshToken('valid-refresh-token');

      expect(jwtVerifySpy).toHaveBeenCalledWith('valid-refresh-token', 'test-access-secret');
      expect(result).toEqual(mockPayload);
    });

    it('should throw error for invalid refresh token', () => {
      jwtVerifySpy.mockImplementation(() => {
        throw new jwt.JsonWebTokenError('Invalid token');
      });

      expect(() => {
        authService.verifyRefreshToken('invalid-token');
      }).toThrow('Invalid refresh token');
    });

    it('should throw error for expired refresh token', () => {
      jwtVerifySpy.mockImplementation(() => {
        throw new jwt.TokenExpiredError('Token expired', new Date());
      });

      expect(() => {
        authService.verifyRefreshToken('expired-token');
      }).toThrow('Invalid refresh token');
    });

    it('should throw generic error for other refresh token verification failures', () => {
      jwtVerifySpy.mockImplementation(() => {
        throw new Error('Unknown error');
      });

      expect(() => {
        authService.verifyRefreshToken('token');
      }).toThrow('Refresh token verification failed');
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh access token successfully', () => {
      const mockPayload = { userId: 'user123', email: 'test@example.com' };
      const mockNewToken = 'new-access-token';
      
      jest.spyOn(authService, 'verifyRefreshToken').mockReturnValue(mockPayload);
      jwtSignSpy.mockReturnValue(mockNewToken);

      const result = authService.refreshAccessToken('valid-refresh-token');

      expect(authService.verifyRefreshToken).toHaveBeenCalledWith('valid-refresh-token');
      expect(jwtSignSpy).toHaveBeenCalledWith(
        { userId: 'user123', email: 'test@example.com' },
        'test-access-secret',
        { expiresIn: '7d' } // Nota: El código usa '7d' en lugar de '15m' para el refresh
      );
      expect(result).toBe(mockNewToken);
    });

    it('should throw error when refresh token verification fails', () => {
      const error = new Error('Invalid refresh token');
      jest.spyOn(authService, 'verifyRefreshToken').mockImplementation(() => {
        throw error;
      });

      expect(() => {
        authService.refreshAccessToken('invalid-refresh-token');
      }).toThrow('Invalid refresh token');

      expect(logSpy).toHaveBeenCalledWith('Error refreshing access token:', error);
    });

    it('should throw error when new token generation fails', () => {
      const mockPayload = { userId: 'user123', email: 'test@example.com' };
      const error = new Error('Token generation failed');
      
      jest.spyOn(authService, 'verifyRefreshToken').mockReturnValue(mockPayload);
      jwtSignSpy.mockImplementation(() => { throw error; });

      expect(() => {
        authService.refreshAccessToken('valid-refresh-token');
      }).toThrow('Token generation failed');

      expect(logSpy).toHaveBeenCalledWith('Error refreshing access token:', error);
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should extract token from valid authorization header', () => {
      const result = authService.extractTokenFromHeader('Bearer valid-token-123');
      expect(result).toBe('valid-token-123');
    });

    it('should throw error when authorization header is missing', () => {
      expect(() => {
        authService.extractTokenFromHeader(undefined);
      }).toThrow('Authorization header missing');
    });

    it('should throw error when authorization header format is invalid', () => {
      expect(() => {
        authService.extractTokenFromHeader('Invalid header format');
      }).toThrow('Invalid authorization header format');
    });

    it('should throw error when token is missing after Bearer', () => {
      expect(() => {
        authService.extractTokenFromHeader('Bearer ');
      }).toThrow('Token missing in authorization header');
    });
  });
});