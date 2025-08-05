import { Request, Response, NextFunction } from 'express';

jest.mock('firebase-functions/logger');
jest.mock('@/utils/contants', () => ({
  Message: {
    _401_UNAUTHORIZED: jest.fn((message: string) => ({ error: message, status: 401 }))
  }
}));

const mockAuthServiceInstance = {
  extractTokenFromHeader: jest.fn(),
  verifyAccessToken: jest.fn(),
  generateTokenPair: jest.fn(),
  verifyRefreshToken: jest.fn(),
  refreshAccessToken: jest.fn()
};

jest.mock('@/infrastructure/services/auth.service', () => ({
  AuthService: jest.fn().mockImplementation(() => mockAuthServiceInstance)
}));

import { authenticateToken } from '@/infrastructure/middleware/auth.middleware';

describe('authenticateToken middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let logSpy: jest.SpyInstance;
  let messageSpy: jest.SpyInstance;

  beforeEach(() => {
    // Reset de los mocks
    mockReq = {
      headers: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    mockNext = jest.fn();
    
    // Limpiar todos los mocks
    jest.clearAllMocks();
    
    logSpy = jest.spyOn(require('firebase-functions/logger'), 'log');
    messageSpy = jest.spyOn(require('@/utils/contants').Message, '_401_UNAUTHORIZED');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should authenticate user successfully and call next()', () => {
    const mockToken = 'valid-token';
    const mockDecoded = { userId: 'user123', email: 'test@example.com' };
    
    mockReq.headers = { authorization: 'Bearer valid-token' };
    mockAuthServiceInstance.extractTokenFromHeader.mockReturnValue(mockToken);
    mockAuthServiceInstance.verifyAccessToken.mockReturnValue(mockDecoded);

    authenticateToken(mockReq as Request, mockRes as Response, mockNext);

    expect(mockAuthServiceInstance.extractTokenFromHeader).toHaveBeenCalledWith('Bearer valid-token');
    expect(mockAuthServiceInstance.verifyAccessToken).toHaveBeenCalledWith(mockToken);
    expect(mockReq.user).toEqual({
      userId: 'user123',
      email: 'test@example.com'
    });
    expect(logSpy).toHaveBeenCalledWith('User authenticated:', 'test@example.com');
    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
  });

  it('should return 401 for expired access token', () => {
    const error = new Error('Access token expired');
    mockReq.headers = { authorization: 'Bearer expired-token' };
    mockAuthServiceInstance.extractTokenFromHeader.mockReturnValue('expired-token');
    mockAuthServiceInstance.verifyAccessToken.mockImplementation(() => { throw error; });

    authenticateToken(mockReq as Request, mockRes as Response, mockNext);

    expect(logSpy).toHaveBeenCalledWith('Authentication error:', 'Access token expired');
    expect(messageSpy).toHaveBeenCalledWith('Access token expired');
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Access token expired', status: 401 });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 for invalid token', () => {
    const error = new Error('Invalid access token');
    mockReq.headers = { authorization: 'Bearer invalid-token' };
    mockAuthServiceInstance.extractTokenFromHeader.mockReturnValue('invalid-token');
    mockAuthServiceInstance.verifyAccessToken.mockImplementation(() => { throw error; });

    authenticateToken(mockReq as Request, mockRes as Response, mockNext);

    expect(logSpy).toHaveBeenCalledWith('Authentication error:', 'Invalid access token');
    expect(messageSpy).toHaveBeenCalledWith('Invalid or missing token');
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid or missing token', status: 401 });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 for missing authorization header', () => {
    const error = new Error('Authorization header missing');
    mockReq.headers = {};
    mockAuthServiceInstance.extractTokenFromHeader.mockImplementation(() => { throw error; });

    authenticateToken(mockReq as Request, mockRes as Response, mockNext);

    expect(logSpy).toHaveBeenCalledWith('Authentication error:', 'Authorization header missing');
    expect(messageSpy).toHaveBeenCalledWith('Invalid or missing token');
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid or missing token', status: 401 });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 for token extraction error', () => {
    const error = new Error('Token missing in authorization header');
    mockReq.headers = { authorization: 'Bearer ' };
    mockAuthServiceInstance.extractTokenFromHeader.mockImplementation(() => { throw error; });

    authenticateToken(mockReq as Request, mockRes as Response, mockNext);

    expect(logSpy).toHaveBeenCalledWith('Authentication error:', 'Token missing in authorization header');
    expect(messageSpy).toHaveBeenCalledWith('Invalid or missing token');
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid or missing token', status: 401 });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 for generic authentication failure', () => {
    const error = new Error('Some other error');
    mockReq.headers = { authorization: 'Bearer some-token' };
    mockAuthServiceInstance.extractTokenFromHeader.mockReturnValue('some-token');
    mockAuthServiceInstance.verifyAccessToken.mockImplementation(() => { throw error; });

    authenticateToken(mockReq as Request, mockRes as Response, mockNext);

    expect(logSpy).toHaveBeenCalledWith('Authentication error:', 'Some other error');
    expect(messageSpy).toHaveBeenCalledWith('Authentication failed');
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Authentication failed', status: 401 });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle non-Error exceptions', () => {
    const error = 'String error';
    mockReq.headers = { authorization: 'Bearer some-token' };
    mockAuthServiceInstance.extractTokenFromHeader.mockReturnValue('some-token');
    mockAuthServiceInstance.verifyAccessToken.mockImplementation(() => { throw error; });

    authenticateToken(mockReq as Request, mockRes as Response, mockNext);

    expect(logSpy).toHaveBeenCalledWith('Authentication error:', 'Authentication failed');
    expect(messageSpy).toHaveBeenCalledWith('Authentication failed');
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Authentication failed', status: 401 });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle token expired error message variation', () => {
    const error = new Error('Token has expired');
    mockReq.headers = { authorization: 'Bearer expired-token' };
    mockAuthServiceInstance.extractTokenFromHeader.mockReturnValue('expired-token');
    mockAuthServiceInstance.verifyAccessToken.mockImplementation(() => { throw error; });

    authenticateToken(mockReq as Request, mockRes as Response, mockNext);

    expect(logSpy).toHaveBeenCalledWith('Authentication error:', 'Token has expired');
    expect(messageSpy).toHaveBeenCalledWith('Access token expired');
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Access token expired', status: 401 });
    expect(mockNext).not.toHaveBeenCalled();
  });
});