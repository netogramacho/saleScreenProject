import { BehaviorSubject, Observable } from 'rxjs';
import { Sale } from '../interfaces/sale';
import { SaleApi } from './../api/sale-api';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private salesSubject$ = new BehaviorSubject<Sale[]>([]);
  constructor(private saleApi: SaleApi) {
    this.loadSales();
  }

  get sales$() {
    return this.salesSubject$.asObservable();
  }

  loadSales() {
    return this.saleApi.get().subscribe(
      (sales: Sale[]) => {
        this.salesSubject$.next(sales);
      },
      (error) => {}
    );
  }

  createSale(sale: Sale): Observable<Sale> {
    return this.saleApi.post(sale).pipe(tap(() => {
      this.loadSales();
    }));
  }
}
