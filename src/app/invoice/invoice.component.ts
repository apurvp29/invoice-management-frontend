import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {ApiService} from "../api.service";
import {InvoiceDataModel} from "../../model/InvoiceDataModel";
import {AgGridAngular} from 'ag-grid-angular';
import {
  CellClickedEvent,
  ColDef,
  NewValueParams,
  SideBarDef,
  SizeColumnsToContentStrategy,
  ValueFormatterParams
} from 'ag-grid-community';
import {ActionButtonRendererComponent} from "../action-button-renderer/action-button-renderer.component";

@Component({
  selector: 'app-invoice',
  standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        AgGridAngular
    ],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent implements OnInit {
  constructor(private apiService: ApiService) {
  }

  allInvoices: InvoiceDataModel[] = [];
  rowData: any = [];

  formatDate(date: string) {
    let parts = date.split('-');
    const formattedDate: string = `${parts[0]}/${parts[1]}/${parts[2]}`;
    return formattedDate;
  }
  ngOnInit(): void {
    this.apiService.getAllInvoices().subscribe({
      next: (value) => {
        value.data.forEach((invoice) => {
          // let businessName: string = "";
          // this.apiService.getBusiness(invoice['billedBy']).subscribe({
          //   next: (fetchedBusiness) => {
          //     console.log(fetchedBusiness.data['name']);
          //     businessName = fetchedBusiness.data['name'];
          //   }
          // });

          // let clientName: string = "";
          // this.apiService.getClient(invoice['billedTo']).subscribe({
          //   next: (fetchedClient) => {
          //     console.log(fetchedClient.data.name);
          //     clientName = fetchedClient.data.name;
          //   }
          // });

          // console.log(clientName, businessName)

          this.allInvoices.push({
            "invoiceId": invoice['invoiceId'],
            "invoiceNumber": invoice['invoiceNumber'],
            "invoiceDate": invoice['invoiceDate'],
            "dueDate": invoice['dueDate'],
            "billedTo": invoice['billedTo'],
            "billedBy": "Fluxbyte Technologies",
            "discount": invoice['discount'],
            "createdAt": invoice['createdAt'],
            "updatedAt": invoice['updatedAt']
          })
        })
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        this.rowData = this.allInvoices.map((invoice) => ({
          "Invoice Id": invoice['invoiceId'],
          "Invoice Number": invoice['invoiceNumber'],
          "Invoice Date": invoice['invoiceDate'].substring(0, 10),
          "Invoice due date": invoice['dueDate'].substring(0, 10),
          "Billed By": invoice.billedBy,
          "Billed To": invoice.billedTo,
          "Discount": invoice['discount'],
          "Created At": invoice['createdAt'].substring(0, 10),
          "Updated At": invoice['updatedAt'].substring(0, 10)
        }));
      }
    })
  }

  onCellClicked(event: CellClickedEvent) {
    console.log("Cell was clicked", event.data)
  }

  onCellValueChanged(event: NewValueParams) {
    const value = {
      invoiceId: event.data['Invoice Id'],
      discount: event.data['Discount']
    }
    this.apiService.updateInvoice(value).subscribe({
      next: val => {
        console.log(val);
      },
      error: err => {
        console.log(err)
      }
    });
  }

  dateFormatter(params: ValueFormatterParams) {
    let parts = params.value.split('-');
    const formattedDate: string = `${parts[2]}/${parts[1]}/${parts[0]}`;
    return formattedDate;
  }

  /*
  if (params.value) {
      const c = new Date(params.value);
      return `${c.getFullYear().toString().padStart(4, '0')}/${(
        c.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}/${c.getDate().toString().padStart(2, '0')}`;
      // return c.toISOString().split('T')[0];
    } else {
      return '';
    }
   */


  public columnDefs: ColDef[] = [
    // {field: "Invoice Id"},
    {field: "Invoice Number"},
    {field: "Invoice Date", valueFormatter: this.dateFormatter},
    {field: "Invoice due date", valueFormatter: this.dateFormatter},
    {field: "Billed By"},
    {field: "Billed To"},
    {
      headerName: 'Discount',
      valueGetter: params => {
        return params.data.Discount;
      },
      valueSetter: params => {
        params.data.Discount = params.newValue;
        return true;
      },
      editable: true,
      minWidth: 180
    },
    {field: "Created At", valueFormatter: this.dateFormatter},
    {field: "Updated At", valueFormatter: this.dateFormatter},
    {field: "Actions", cellRenderer: ActionButtonRendererComponent}
  ];

  // public columnDefs: ColDef[] = [
  //   {
  //     field: 'athlete',
  //     minWidth: 150,
  //   },
  //   { field: 'age' },
  //   { field: 'country', minWidth: 130},
  //   { field: 'year' },
  //   { field: 'date' },
  //   { field: 'sport' },
  //   { field: 'gold' },
  //   { field: 'silver' },
  //   { field: 'bronze' },
  //   { field: 'total' },
  // ];
  public defaultColDef: ColDef = {
    filter: true,
  };

  public autoSizeStrategy: SizeColumnsToContentStrategy = {type: "fitCellContents"}
}
