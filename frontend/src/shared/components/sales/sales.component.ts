import { Component, OnInit } from '@angular/core';
import { Product } from 'src/shared/interfaces/product';
import { Sale } from 'src/shared/interfaces/sale';
import { SpinnerService } from 'src/shared/services/SpinnerService.service';
import { ProductService } from 'src/shared/services/product.service';
import { SaleService } from 'src/shared/services/sale.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent implements OnInit {
  products!: Product[];
  sales!: Sale[];
  showSpinner!: boolean;

  constructor(
    private productService: ProductService,
    private saleService: SaleService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.productService.products$.subscribe((products) => {
      this.products = products;
    });
    this.saleService.sales$.subscribe((sales) => {
      this.sales = sales;
    });

    this.spinnerService.spinnerState$.subscribe((load: boolean) => {
      this.showSpinner = load;
    });
  }
}
