import { Component, Input, OnInit } from '@angular/core';
import { Sale } from 'src/shared/interfaces/sale';

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.scss']
})
export class SalesListComponent implements OnInit {

  @Input() sales!:Sale[];
  displayedColumns = ["saleId", "saleDate", "saleTotal", "saleTax"]

  constructor() { }

  ngOnInit(): void {
  }

}
