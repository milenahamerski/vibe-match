import { HttpException, HttpStatus } from '@nestjs/common';

export class LimiteFavoritosExcedidoException extends HttpException {
  constructor(limiteMaximo: number, totalTentado: number) {
    super(
      `Operação negada: Seu limite de ${limiteMaximo} favoritos no plano Gratuito foi excedido (tentativa de configurar ${totalTentado} favoritos).`,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
