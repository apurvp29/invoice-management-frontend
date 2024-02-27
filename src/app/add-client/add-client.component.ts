import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../api.service';
import { CreateClientModel } from '../../model/CreateClientModel';

@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [
    AgGridAngular,
    RouterLink,
    RouterLinkActive,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.css',
})
export class AddClientComponent {
  clientFormInformation: FormGroup;
  isAllValid: boolean = false;

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.clientFormInformation = fb.group({
      businessName: ['', Validators.required],
      clientIndustry: ['', Validators.required],
      gstNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}'
          ),
        ],
      ],
      panNumber: [
        '',
        [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')],
      ],
      alias: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });
  }

  clientType: string = 'INDIVISUAL';
  logo: string = '';
  tanNumber: string = 'tan';
  vatNumber: string = 'vat';

  selectedDropdown: number = 1;
  tabs: { name: string; id: number; open: boolean }[] = [
    {
      name: 'Business Information',
      id: 1,
      open: true,
    },
    {
      name: 'Tax Information',
      id: 2,
      open: false,
    },
    {
      name: 'Address',
      id: 3,
      open: false,
    },
    {
      name: 'Shipping Details',
      id: 4,
      open: false,
    },
    {
      name: 'Additional Details',
      id: 5,
      open: false,
    },
  ];

  onSelectTDropdown(id: number) {
    this.selectedDropdown === id;
    this.tabs[id - 1].open = !this.tabs[id - 1].open;
  }

  get f() {
    return this.clientFormInformation;
  }

  onCreateClient() {
    if (
      this.f.controls['businessName'].errors?.['required'] ||
      this.f.controls['clientIndustry'].errors?.['required'] ||
      this.f.controls['gstNumber'].errors?.['required'] ||
      this.f.controls['panNumber'].errors?.['required'] ||
      this.f.controls['email'].errors?.['required'] ||
      this.f.controls['phone'].errors?.['required'] ||
      this.f.controls['gstNumber'].errors?.['pattern'] ||
      this.f.controls['panNumber'].errors?.['pattern'] ||
      this.f.controls['email'].errors?.['email']
    ) {
      this.isAllValid = true;
      return;
    }
    const payload: CreateClientModel = {
      name: this.f.value['businessName'],
      industryName: this.f.value['clientIndustry'],
      clientType: this.clientType,
      logo: this.logo,
      gst: this.f.value['gstNumber'],
      email: this.f.value['email'],
      pan: this.f.value['panNumber'],
      tan: this.tanNumber,
      vat: this.vatNumber,
      nickName: this.f.value['alias'],
      phone: this.f.value['phone'],
    };
  }
}
