import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-invoice-new',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './invoice-new.component.html',
  styleUrl: './invoice-new.component.css',
})
export class InvoiceNewComponent {}
