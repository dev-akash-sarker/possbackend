import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from 'src/generated/prisma/client';
export class UpdateProductDto {
  name?: string;
  sku?: string;
  price?: number;
  stock_quantity?: number;
}
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  async newProduct(
    @Body()
    body: {
      name: string;
      sku: string;
      price: number;
      stock_quantity: number;
    },
  ): Promise<Product> {
    const { name, sku, price, stock_quantity } = body;
    return this.productService.createProduct(name, sku, price, stock_quantity);
  }

  @Get('list')
  async getAllProducts() {
    return this.productService.listProduct();
  }

  @Patch('update/:id')
  async editProduct(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.updateProduct(Number(id), body);
  }

  @Delete('delete/:id')
  async removeProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(Number(id));
  }
}
