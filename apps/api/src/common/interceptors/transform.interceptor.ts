import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // Evitar formatar se for documentação do Swagger ou rotas específicas se necessário
    const request = context.switchToHttp().getRequest();
    if (request.url.includes('/api-json') || request.url.includes('/api-yaml') || request.url.startsWith('/api/')) {
      // Mas se for /api/conteudos etc. we can format. Wait! Swagger UI itself needs to load, and it calls /api/ which returns HTML. We shouldn't format HTML/Swagger.
      const response = context.switchToHttp().getResponse();
      if (response.headersSent || response.getHeader?.('content-type')?.includes('html')) {
        return next.handle();
      }
    }

    return next.handle().pipe(
      map((data) => {
        // Se já estiver no formato { success: true }, apenas retorna
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }
        return { success: true, data };
      }),
    );
  }
}
