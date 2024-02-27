import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css',
})
export class ConfirmComponent {
  @Output() visibilityChild = new EventEmitter<boolean>();
  @Input() invoiceId!: string;
  constructor(
    private apiService: ApiService
  ) {}

  onCancel() {
    this.visibilityChild.emit(false);
  }

  onDelete() {
    this.apiService.deleteInvoice(this.invoiceId).subscribe({
      next: (value) => {},
    });
    this.visibilityChild.emit(false);
  }
}
