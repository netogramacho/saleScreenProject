import { SaleProduct } from './saleProduct';

export interface Sale {
  saleProducts: SaleProduct[];
  saleId?: number;
  saleDate?: Date;
  saleTotal: number;
  saleTax: number;
}
