export interface Product {
  categoryId: number | string;
  categoryName?: string;
  categoryTax?: number;
  productActive?: number;
  productDescription: string;
  productId?: number | string;
  productName: string;
  productPrice: string;
  taxValue: string;
}
