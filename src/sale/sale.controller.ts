import { Body, Controller, Post } from '@nestjs/common';
import { SaleService } from './sale.service';

@Controller('sale')
export class SaleController {
  constructor(private readonly salesService: SaleService) {}
  @Post('create')
  createSale(
    @Body() body: { items: { productId: number; quantity: number }[] },
  ) {
    return this.salesService.createSale(body.items);
  }
}
