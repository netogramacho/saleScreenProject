import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from 'src/shared/interfaces/product';

@Component({
  selector: 'app-dialog-search',
  templateUrl: './dialog-search.component.html',
  styleUrls: ['./dialog-search.component.scss'],
})
export class DialogSearchComponent {
  searchTerm = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogSearchComponent>
  ) {}

  onCloseDialog(product: Product) {
    this.dialogRef.close(product);
  }
}
