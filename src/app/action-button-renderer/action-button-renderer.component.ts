import { Component } from '@angular/core';
import { AgGridAngular, ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { NgIf } from '@angular/common';
import { ConfirmComponent } from '../confirm/confirm.component';
import { ActionService } from '../action.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-action-button-renderer',
  standalone: true,
  imports: [
    AgGridAngular,
    NgIf,
    ConfirmComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './action-button-renderer.component.html',
  styleUrl: './action-button-renderer.component.css',
})
export class ActionButtonRendererComponent implements ICellRendererAngularComp {
  public value!: { 'Invoice Id': string };
  invoiceId: string = '';
  agInit(params: ICellRendererParams): void {
    this.value = params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    this.value = params.data;
    return true;
  }
  constructor(private actionService: ActionService) {
  }

  onEditClick() {
    this.invoiceId = this.value['Invoice Id'];
  }

  onViewClick() {
    this.invoiceId = this.value['Invoice Id'];
  }

  onDeleteClick() {
    this.actionService.visibilitySubject.next(true);
    this.invoiceId = this.value['Invoice Id'];
    this.actionService.deleteInvoiceId.next(this.invoiceId);
  }
}
