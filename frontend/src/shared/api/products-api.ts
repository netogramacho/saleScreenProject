import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Product } from '../interfaces/product';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class ProductApi {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private http: HttpClient) {}

  get(): Observable<Product[]> {
    return this.http
      .get<any>(environment.productApi)
      .pipe(retry(1), catchError(this.handleError));
  }

  post(product: Product) {
    return this.http
      .post<any>(environment.productApi, product, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  put(product: Product) {
    return this.http
      .put<any>(
        environment.productApi + product.productId,
        product,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  delete(productId: any) {
    return this.http
      .delete<any>(environment.productApi + productId)
      .pipe(retry(1), catchError(this.handleError));
  }

  handleError(exception: ErrorEvent) {
    return throwError(exception.error.message);
  }
}
