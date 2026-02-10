import { Injectable } from '@nestjs/common';
import { Product } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(
    name: string,
    sku: string,
    price: number,
    stock_quantity: number,
  ): Promise<Product> {
    return this.prisma.product.create({
      data: { name, sku, price, stock_quantity },
    });
  }

  async listProduct(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async updateProduct(
    id: number,
    data: {
      name?: string;
      sku?: string;
      price?: number;
      stock_quantity?: number;
    },
  ): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
