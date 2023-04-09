import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/shared/interfaces/product';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {
  @Input() product!:Product;

  constructor() { }

  ngOnInit(): void {
  }

}
