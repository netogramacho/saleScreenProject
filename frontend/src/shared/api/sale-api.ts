import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Sale } from '../interfaces/sale';

@Injectable()
export class SaleApi {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private http: HttpClient) {}

  get(): Observable<Sale[]> {
    return this.http
      .get<Sale[]>(environment.saleApi)
      .pipe(catchError(this.handleError));
  }

  post(sale: Sale): Observable<Sale> {
    return this.http
      .post<Sale>(environment.saleApi, sale, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  handleError(exception: ErrorEvent) {
    return throwError(exception.error.message);
  }
}
