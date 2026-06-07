import { TransformInterceptor } from './transform.interceptor';
import { of } from 'rxjs';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<any>;

  beforeEach(() => {
    interceptor = new TransformInterceptor();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should format response correctly', (done) => {
    const mockRequest = { url: '/usuarios' };
    const mockResponse = { getHeader: jest.fn().mockReturnValue('application/json') };
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    } as any;
    const mockCallHandler = {
      handle: jest.fn().mockReturnValue(of({ name: 'Test' })),
    };

    interceptor.intercept(mockContext, mockCallHandler).subscribe((result) => {
      expect(result).toEqual({ success: true, data: { name: 'Test' } });
      done();
    });
  });

  it('should not wrap if response already has success property', (done) => {
    const mockRequest = { url: '/usuarios' };
    const mockResponse = { getHeader: jest.fn().mockReturnValue('application/json') };
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    } as any;
    const mockCallHandler = {
      handle: jest.fn().mockReturnValue(of({ success: true, data: 'Already formatted' })),
    };

    interceptor.intercept(mockContext, mockCallHandler).subscribe((result) => {
      expect(result).toEqual({ success: true, data: 'Already formatted' });
      done();
    });
  });

  it('should return raw data if html content type', (done) => {
    const mockRequest = { url: '/api/' };
    const mockResponse = { getHeader: jest.fn().mockReturnValue('text/html') };
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    } as any;
    const mockCallHandler = {
      handle: jest.fn().mockReturnValue(of('<html></html>')),
    };

    interceptor.intercept(mockContext, mockCallHandler).subscribe((result) => {
      expect(result).toEqual('<html></html>');
      done();
    });
  });
});
