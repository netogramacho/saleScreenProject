import { Product } from './../../interfaces/product';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/shared/services/product.service';
import { Category } from 'src/shared/interfaces/category';
import { CategoriesService } from 'src/shared/services/categories.service';
import { SideDialogComponent } from '../side-dialog/side-dialog.component';
import { MatTable } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerService } from 'src/shared/services/SpinnerService.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  @ViewChild(SideDialogComponent) sideDialog!: SideDialogComponent;
  @ViewChild(MatTable) table!: MatTable<any>;

  products!: Product[];
  categories!: Category[];
  showSpinner!: boolean;
  displayedColumns = [
    'productId',
    'productName',
    'productPrice',
    'taxValue',
    'edit',
    'delete',
  ];
  isDialogOpen = false;

  currProduct: Product;

  constructor(
    private productService: ProductService,
    private categoriesService: CategoriesService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService
  ) {
    this.currProduct = {
      productId: '',
      productName: '',
      productDescription: '',
      productPrice: '',
      categoryId: '',
      taxValue: '',
    };
  }

  ngOnInit(): void {
    this.categoriesService.categories$.subscribe((categories) => {
      this.categories = categories;
    });

    this.productService.products$.subscribe((products) => {
      this.products = products;
    });

    this.spinnerService.spinnerState$.subscribe((load: boolean) => {
      this.showSpinner = load;
    });
  }

  prepareAddProduct() {
    this.isDialogOpen = true;
  }

  saveProduct() {
    if (this.currProduct.productId) {
      this.productService.updateProduct(this.currProduct).subscribe(
        () => {
          this.snackBar.open('Produto editado com sucesso.', '', {
            duration: 3000,
          });
        },
        (error) => {
          this.snackBar.open(error, 'X', { duration: 5000 });
        }
      );
    } else {
      this.productService.createProduct(this.currProduct).subscribe(
        () => {
          this.snackBar.open('Produto criado com sucesso.', '', {
            duration: 3000,
          });
        },
        (error) => {
          this.snackBar.open(error, 'X', { duration: 5000 });
        }
      );
    }
    this.sideDialog.close();
    this.clearCurrProduct();
  }

  deleteProduct(product: Product) {
    this.productService.deleteProduct(product).subscribe(
      () => {
        this.snackBar.open('Produto excluído com sucesso.', '', {
          duration: 3000,
        });
      },
      (error) => {
        this.snackBar.open(error, 'X', { duration: 5000 });
      }
    );
  }

  editProduct(product: Product) {
    this.currProduct = { ...product };
    this.isDialogOpen = true;
  }

  clearCurrProduct() {
    this.currProduct = {
      productId: '',
      productName: '',
      productDescription: '',
      productPrice: '',
      categoryId: '',
      taxValue: '',
    };
  }
}
