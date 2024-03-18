import { Component, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef } from 'ag-grid-community';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ClientModel } from '../../model/ClientModel';
import { ApiService } from '../api.service';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { NgIf } from '@angular/common';
import { ClientActionComponent } from '../client-action/client-action.component';
import { ConfirmComponent } from '../confirm/confirm.component';
import { ActionService } from '../action.service';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [
    RouterOutlet,
    AgGridAngular,
    RouterLink,
    RouterLinkActive,
    LottieComponent,
    NgIf,
    ConfirmComponent,
  ],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent implements OnInit {
  allClients: ClientModel[] = [];
  isLoading: boolean = true;
  visibility: boolean = false;
  clientId: string = '';
  constructor(
    private apiService: ApiService,
    private deleteService: ActionService
  ) {
    this.deleteService.visibilityClient.next(false);
    this.deleteService.visibilityClient.subscribe({
      next: (value) => {
        this.visibility = value;
      },
    });
    this.deleteService.deleteClientId.subscribe({
      next: (value) => {
        this.clientId = value;
      },
    });
  }
  options: AnimationOptions = {
    path: 'assets/loading-fb.json',
  };

  rowData: {
    Name: string;
    Industry: string;
    PAN: string;
    TAN: string;
    VAT: string;
    GST: string;
    Email: string;
    Phone: string;
  }[] = [];

  onChangeVisibility(val: boolean) {
    this.visibility = val;
  }

  ngOnInit(): void {
    this.apiService.getAllClients().subscribe({
      next: (value) => {
        value.data.forEach((client) => {
          this.allClients.push(client);
        });
        this.rowData = this.allClients.map((client) => ({
          clientId: client.clientId,
          Name: client.name,
          Industry: client.industryName,
          PAN: client.pan,
          TAN: client.tan,
          VAT: client.vat,
          GST: client.gst,
          Email: client.email,
          Phone: client.phone,
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onCellClicked(event: CellClickedEvent) {}

  colDefs: ColDef[] = [
    { field: 'Name' },
    { field: 'Industry' },
    { field: 'PAN' },
    { field: 'TAN' },
    { field: 'VAT' },
    { field: 'GST' },
    { field: 'Email' },
    { field: 'Phone' },
    { field: 'Actions', cellRenderer: ClientActionComponent },
  ];
}
