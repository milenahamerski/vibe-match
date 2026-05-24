import { ExceptionFilter, Catch, ArgumentsHost, Logger, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { LimiteFavoritosExcedidoException } from '../exceptions/limite-favoritos-excedido.exception';

@Catch(LimiteFavoritosExcedidoException)
export class OfertaPremiumFilter implements ExceptionFilter {
  private readonly logger = new Logger(OfertaPremiumFilter.name);

  catch(exception: LimiteFavoritosExcedidoException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // REGISTRO DE AVISO NO CONSOLE DO SERVIDOR (logger.warn)
    this.logger.warn(
      `[${request.method}] ${request.url} - Alerta de Negócio: Limite de favoritos violado. Retornando proposta de Upgrade Premium.`,
    );

    // FORMATO DE RESPOSTA AO CLIENTE
    response.status(status).json({
      erro: 'Regra de Negócio Violada',
      mensagem: exception.message,
      sugestaoAutomatica: 'Que tal assinar o VibeMatch Premium por apenas R$ 9,90/mês para ter favoritos ilimitados e sem anúncios?',
      data: new Date().toISOString(),
    });
  }
}
