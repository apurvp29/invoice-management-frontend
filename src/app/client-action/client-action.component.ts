import { Component } from '@angular/core';
import { AgGridAngular, ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ActionService } from '../action.service';

@Component({
  selector: 'app-client-action',
  standalone: true,
  imports: [AgGridAngular, RouterLink, RouterLinkActive],
  templateUrl: './client-action.component.html',
  styleUrl: './client-action.component.css',
})
export class ClientActionComponent implements ICellRendererAngularComp {
  public value!: { clientId: string };
  clientId: string = '';
  agInit(params: ICellRendererParams): void {
    this.value = params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    this.value = params.data;
    return true;
  }

  constructor(private actionService: ActionService) {}

  onEditClick() {
    this.clientId = this.value.clientId;
  }

  onDeleteClick() {
    this.actionService.visibilityClient.next(true);
    this.clientId = this.value.clientId;
    this.actionService.deleteClientId.next(this.clientId);
  }
}
