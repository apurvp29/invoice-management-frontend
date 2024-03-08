import { Component, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { ClientModel } from '../../model/ClientModel';
import { ApiService } from '../api.service';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [RouterOutlet, AgGridAngular, RouterLink, RouterLinkActive, LottieComponent, NgIf],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent implements OnInit {
  constructor(private apiService: ApiService) {}
  options: AnimationOptions = {
    path: 'assets/loading-fb.json',
  };
  allClients: ClientModel[] = [];
  isLoading: boolean = true;
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
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

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
