import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ResponseModel } from '../../model/ResponseModel';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  constructor(private apiService: ApiService) {}

  businessDetails: [] | undefined;

  ngOnInit(): void {
    this.apiService.getBusinessDetails().subscribe({
      next: (value: ResponseModel) => {
        this.businessDetails = value.data;
      },
      error: (err) => {},
    });
  }

  onPdfDownload() {}
}
