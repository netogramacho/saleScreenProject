import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-side-dialog',
  templateUrl: './side-dialog.component.html',
  styleUrls: ['./side-dialog.component.scss']
})
export class SideDialogComponent {
  @Input() isOpen: boolean = false;
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
  isClosing: boolean = false;

  close() {
    this.isClosing = true;
    setTimeout(() => {
      this.isClosing = false;
      this.onClose.emit();
    }, 300);
  }
}
