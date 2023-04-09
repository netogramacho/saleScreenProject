import { Injectable } from '@angular/core';
import { ProductApi } from '../api/products-api';
import { Product } from '../interfaces/product';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsSubject$ = new BehaviorSubject<Product[]>([]);

  constructor(private productApi: ProductApi) {
    this.loadProducts();
  }

  get products$() {
    return this.productsSubject$.asObservable();
  }

  loadProducts() {
    return this.productApi.get().subscribe(
      (products: Product[]) => {
        this.productsSubject$.next(products);
      },
      (error) => {}
    );
  }

  createProduct(product: Product) {
    return this.productApi.post(product).pipe(
      tap(() => {
        this.loadProducts();
      })
    );
  }

  updateProduct(product: Product) {
    return this.productApi.put(product).pipe(
      tap(() => {
        this.loadProducts();
      })
    );
  }

  deleteProduct(product: Product) {
    return this.productApi.delete(product.productId).pipe(
      tap(() => {
        this.loadProducts();
      })
    );
  }
}
