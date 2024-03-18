import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '../api.service';
import { InvoiceDataModel } from '../../model/InvoiceDataModel';
import { AgGridAngular } from 'ag-grid-angular';
import {
  CellClickedEvent,
  ColDef,
  SizeColumnsToContentStrategy,
  ValueFormatterParams,
} from 'ag-grid-community';
import { ActionButtonRendererComponent } from '../action-button-renderer/action-button-renderer.component';
import { ConfirmComponent } from '../confirm/confirm.component';
import { NgIf } from '@angular/common';
import { ActionService } from '../action.service';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { ClientModel } from '../../model/ClientModel';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    AgGridAngular,
    ConfirmComponent,
    NgIf,
    LottieComponent,
  ],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css',
})
export class InvoiceComponent implements OnInit {
  visibility: boolean = false;
  invoiceId: string = '';
  options: AnimationOptions = {
    path: 'assets/loading-fb.json',
  };
  isLoading: boolean = true;
  constructor(
    private apiService: ApiService,
    private deleteService: ActionService,
    private route: Router
  ) {
    this.deleteService.visibilitySubject.next(false);
    this.deleteService.visibilitySubject.subscribe({
      next: (value) => {
        this.visibility = value;
      },
    });
    this.deleteService.deleteInvoiceId.subscribe({
      next: (value) => {
        this.invoiceId = value;
      },
    });
  }

  allClients: ClientModel[] = [];
  allInvoices: InvoiceDataModel[] = [];
  rowData: any = [];

  formatDate(date: string) {
    let parts = date.split('-');
    const formattedDate: string = `${parts[0]}/${parts[1]}/${parts[2]}`;
    return formattedDate;
  }

  ngOnInit(): void {
    this.apiService.getAllClients().subscribe({
      next: (value) => {
        value.data.forEach((client) => {
          this.allClients.push(client);
        });
        this.apiService.getAllInvoices().subscribe({
          next: (value) => {
            value.data.forEach((invoice) => {
              let clientName = '';
              for (let i = 0; i < this.allClients.length; i++) {
                if (this.allClients[i].clientId === invoice['billedTo']) {
                  clientName = this.allClients[i].name;
                  break;
                }
              }
              this.allInvoices.push({
                invoiceId: invoice['invoiceId'],
                invoiceNumber: invoice['invoiceNumber'],
                invoiceDate: invoice['invoiceDate'],
                dueDate: invoice['dueDate'],
                billedTo: clientName,
                billedBy: 'Fluxbyte Technologies',
                discount: invoice['discount'],
                createdAt: invoice['createdAt'],
                updatedAt: invoice['updatedAt'],
              });
            });
            this.rowData = this.allInvoices.map((invoice) => ({
              'Invoice Id': invoice['invoiceId'],
              'Invoice Number': invoice['invoiceNumber'],
              'Invoice Date': invoice['invoiceDate'].substring(0, 10),
              'Invoice due date': invoice['dueDate'].substring(0, 10),
              'Billed By': invoice.billedBy,
              'Billed To': invoice.billedTo,
              'Created At': invoice['createdAt'].substring(0, 10),
              'Updated At': invoice['updatedAt'].substring(0, 10),
            }));
            this.isLoading = false;
          },
          error: (err) => {
            console.error(err);
          },
        });
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onChangeVisibility(val: boolean) {
    this.visibility = val;
  }
  onCellClicked(event: CellClickedEvent) {
    if (event.colDef.field === 'Invoice Number') {
      this.route.navigate(
        [`/invoice/view-invoice/${event.data['Invoice Id']}`],
        {
          queryParams: { view: true },
        }
      );
    }
  }

  dateFormatter(params: ValueFormatterParams) {
    let parts = params.value.split('-');
    const formattedDate: string = `${parts[2]}/${parts[1]}/${parts[0]}`;
    return formattedDate;
  }

  public columnDefs: ColDef[] = [
    { field: 'Invoice Number' },
    { field: 'Invoice Date', valueFormatter: this.dateFormatter },
    { field: 'Invoice due date', valueFormatter: this.dateFormatter },
    { field: 'Billed By' },
    { field: 'Billed To' },
    { field: 'Created At', valueFormatter: this.dateFormatter },
    { field: 'Updated At', valueFormatter: this.dateFormatter },
    { field: 'Actions', cellRenderer: ActionButtonRendererComponent },
  ];

  public defaultColDef: ColDef = {
    filter: true,
  };
}
