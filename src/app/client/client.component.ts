import { Component, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridApi } from 'ag-grid-community';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { ClientModel } from '../../model/ClientModel';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [RouterOutlet, AgGridAngular, RouterLink, RouterLinkActive],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent implements OnInit {
  constructor(private router: Router, private apiService: ApiService) {}

  allClients: ClientModel[] = [];

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
  ngOnInit(): void {
    this.apiService.getAllClients().subscribe({
      next: (value) => {
        value.data.forEach((client) => {
          this.allClients.push(client);
        });
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.rowData = this.allClients.map((client) => ({
          Name: client.name,
          Industry: client.industryName,
          PAN: client.pan,
          TAN: client.tan,
          VAT: client.vat,
          GST: client.gst,
          Email: client.email,
          Phone: client.phone,
        }));
      },
    });
  }
  gridApi!: GridApi;
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
  ];
}
