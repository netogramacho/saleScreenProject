import { SaleProduct } from './../../interfaces/saleProduct';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogSearchComponent } from '../dialog-search/dialog-search.component';
import { Product } from 'src/shared/interfaces/product';
import { ProductService } from 'src/shared/services/product.service';
import { Sale } from 'src/shared/interfaces/sale';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SaleService } from 'src/shared/services/sale.service';

@Component({
  selector: 'app-new-sale',
  templateUrl: './new-sale.component.html',
  styleUrls: ['./new-sale.component.scss'],
})
export class NewSaleComponent implements OnInit {
  allProducts!: Product[];
  currProducts!: Product[];
  currSale: Sale;
  allSales!: Sale[];

  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private saleService: SaleService
  ) {
    this.currSale = {
      saleTotal: 0,
      saleTax: 0,
      saleProducts: [],
    };
  }

  ngOnInit(): void {
    this.productService.products$.subscribe((products) => {
      this.allProducts = products;
      this.filterProducts(products);
    });
    this.saleService.sales$.subscribe((sales) => {
      this.allSales = sales;
    });
  }

  filterProducts(products: Product[]) {
    this.currProducts = products.filter((product) => {
      return !this.currSale.saleProducts.some(
        (saleProduct) => saleProduct.product.productId === product.productId
      );
    });
  }

  openFindProduct() {
    const dialogRef = this.dialog.open(DialogSearchComponent, {
      data: this.currProducts,
    });

    dialogRef.afterClosed().subscribe((result: Product) => {
      if (result) {
        this.currSale.saleProducts.push({ product: result, quantity: 1 });
        this.updateCurrentSale();
        this.filterProducts(this.currProducts);
      }
    });
  }

  updateCurrentSale() {
    this.currSale.saleTotal = 0;
    this.currSale.saleTax = 0;
    this.currSale.saleProducts.forEach((saleProduct) => {
      this.currSale.saleTotal +=
        parseFloat(saleProduct.product.productPrice) * saleProduct.quantity;
      this.currSale.saleTax +=
        parseFloat(saleProduct.product.taxValue) * saleProduct.quantity;
    });
  }

  incrementQuantity(productId: number) {
    this.currSale.saleProducts.find((saleProduct) => {
      if (saleProduct.product.productId == productId) {
        saleProduct.quantity += 1;
      }
      this.updateCurrentSale();
    });
  }

  decrementQuantity(productId: number) {
    this.currSale.saleProducts.find((saleProduct) => {
      if (saleProduct.product.productId == productId) {
        if (saleProduct.quantity > 1) {
          saleProduct.quantity -= 1;
        } else {
          this.snackBar.open('The minimum quantity for a product is 1.', 'X', {
            duration: 3000,
          });
        }
      }
      this.updateCurrentSale();
    });
  }

  removeProduct(productId: number) {
    const index = this.currSale.saleProducts.findIndex(
      (saleProduct: SaleProduct) => saleProduct.product.productId == productId
    );
    if (index != -1) {
      this.currSale.saleProducts.splice(index, 1);
      this.filterProducts(this.allProducts);
    }
  }

  saveSale() {
    this.saleService.createSale(this.currSale).subscribe((sale: Sale) => {
      this.clearCurrSale();
    });
  }

  clearCurrSale() {
    this.currSale = {
      saleTotal: 0,
      saleTax: 0,
      saleProducts: [],
    };
  }
}
