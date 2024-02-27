import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { NgForOf, NgIf } from '@angular/common';
import { ClientModel } from '../../model/ClientModel';
import { BusinessModel } from '../../model/BusinessModel';
import { InvoiceModel } from '../../model/InvoiceModel';
import { InvoiceDataModel } from '../../model/InvoiceDataModel';
import { InvoiceDetailModel } from '../../model/InvoiceDetailModel';

@Component({
  selector: 'app-create-invoice',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    FormsModule,
  ],
  templateUrl: './create-invoice.component.html',
  styleUrl: './create-invoice.component.css',
})
export class CreateInvoiceComponent implements OnInit {
  invoiceId: string = '';
  constructor(
    private apiService: ApiService,
    private router: ActivatedRoute,
    private route: Router
  ) {}

  invoiceNumber: string | undefined;
  invoiceDate: Date | undefined;
  invoiceDueDate: Date | undefined;

  viewOnly: boolean = false;

  allClients: ClientModel[] = [];
  selectedClient: string | undefined;
  clientObj: ClientModel | undefined;
  businessObj: BusinessModel | undefined;
  currentInvoiceDetail: InvoiceDetailModel | undefined;
  allInvoices: [] = [];
  currentInvoice: InvoiceDataModel | undefined;
  numOfItems: number = 1;
  itemId: string[] = [];
  itemName: string[] = [];
  quantity: number[] = [];
  rate: number[] = [];
  amount: number[] = [];
  totalAmount: number = 0;
  showInvalidNumber: boolean = false;

  ngOnInit() {
    this.apiService.getAllClients().subscribe({
      next: (value) => {
        this.allClients = value.data;
      },
    });

    this.apiService.getBusinessDetails().subscribe({
      next: (value) => {
        value.data.forEach((business: BusinessModel) => {
          this.businessObj = business;
        });
      },
    });

    this.apiService.getAllInvoices().subscribe({
      next: (value) => {
        this.allInvoices = value.data;
        this.router.params.subscribe((params) => {
          this.invoiceId = params['id'];
          if (this.invoiceId) {
            this.apiService.getInvoiceDetail(this.invoiceId).subscribe({
              next: (value) => {
                this.currentInvoiceDetail = value;
                this.numOfItems =
                  this.currentInvoiceDetail.data.itemsInvoice.length;
                this.totalAmount = this.currentInvoiceDetail.data.totalAmount;
                for (
                  let i = 0;
                  i < this.currentInvoiceDetail.data.itemsInvoice.length;
                  i++
                ) {
                  this.itemName[i] =
                    this.currentInvoiceDetail.data.itemsInvoice[i].itemName;
                  this.quantity[i] =
                    this.currentInvoiceDetail.data.itemsInvoice[i].quantity;
                  this.rate[i] =
                    this.currentInvoiceDetail.data.itemsInvoice[i].rate;
                  this.amount[i] = this.rate[i] * this.quantity[i];
                  this.itemId[i] =
                    this.currentInvoiceDetail.data.itemsInvoice[
                      i
                    ].invoiceItemsId;
                }
              },
            });

            for (let i = 0; i < this.allInvoices.length; i++) {
              if (this.allInvoices[i]['invoiceId'] === this.invoiceId) {
                this.currentInvoice = this.allInvoices[i];
                break;
              }
            }
            for (let client of this.allClients) {
              if (client['clientId'] === this.currentInvoice?.billedTo) {
                this.clientObj = client;
                break;
              }
            }
          }
        });
        this.router.queryParams.subscribe((query) => {
          this.viewOnly = query['view'];
        });
      },
      error: (err) => {},
    });
  }

  onSelectClient() {
    for (let client of this.allClients) {
      if (client['clientId'] === this.selectedClient) {
        this.clientObj = client;
        break;
      }
    }
  }

  checkValidInvoiceNumber() {
    for (let invoice of this.allInvoices) {
      if (this.invoiceNumber === invoice['invoiceNumber']) {
        this.showInvalidNumber = true;
        break;
      } else {
        this.showInvalidNumber = false;
      }
    }
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

  onAddItem() {
    this.numOfItems++;
  }

  updateAmount(i: number) {
    this.amount[i] = this.rate[i] * this.quantity[i];
    this.totalAmount = 0;
    for (let a of this.amount) {
      this.totalAmount += a ? a : 0;
    }
  }

  formatDate(date: string) {
    let parts = date.split('-');
    const formattedDate: string = `${parts[0]}-${parts[1]}-${parts[2]}`;
    return formattedDate;
  }

  onRemoveItem(index: number) {
    this.itemName.splice(index, 1);
    this.quantity.splice(index, 1);
    this.rate.splice(index, 1);
    this.totalAmount -= this.amount[index];
    this.amount.splice(index, 1);
    this.itemId.splice(index, 1);
    this.numOfItems--;
  }

  onUpdate() {
    const value = {
      invoiceId: this.invoiceId,
      invoiceDate: new Date(this.invoiceDate!),
      dueDate: new Date(this.invoiceDueDate!),
    };
    this.apiService.updateInvoice(value).subscribe({
      next: (value) => {
        let set = new Set<number>();
        for (let i = 0; i < this.itemId.length; i++) {
          for (
            let j = 0;
            j < this.currentInvoiceDetail!.data.itemsInvoice.length;
            j++
          ) {
            if (
              this.itemId[i] ===
              this.currentInvoiceDetail!.data.itemsInvoice[j].invoiceItemsId
            ) {
              set.add(i);
              const payload = {
                itemName: this.itemName[i],
                quantity: this.quantity[i],
                rate: Number(this.rate[i]),
              };
              this.apiService
                .updateInvoiceItem(this.itemId[i], payload)
                .subscribe({
                  next: (value) => {},
                });
              break;
            }
          }
        }

        for (
          let i = 0;
          i < this.currentInvoiceDetail!.data.itemsInvoice.length;
          i++
        ) {
          let isPresent = false;
          for (let j = 0; j < this.itemId.length; j++) {
            if (
              this.itemId[j] ===
              this.currentInvoiceDetail!.data.itemsInvoice[i].invoiceItemsId
            ) {
              isPresent = true;
              break;
            }
          }
          if (!isPresent) {
            this.apiService
              .deleteInvoiceItem(
                this.currentInvoiceDetail!.data.itemsInvoice[i].invoiceItemsId
              )
              .subscribe({
                next: (val) => {},
              });
          }
        }

        for (let i = 0; i < this.itemName.length; i++) {
          if (!set.has(i)) {
            const payload = {
              itemName: this.itemName[i],
              quantity: this.quantity[i],
              rate: this.rate[i],
            };
            this.apiService.createInvoiceItems(payload, this.invoiceId);
          }
        }
      },
      error: (err) => {},
    });
  }

  onSubmit() {
    const invoiceDetail: InvoiceModel = {
      invoiceNumber: this.invoiceNumber!,
      invoiceDate: this.invoiceDate!,
      dueDate: this.invoiceDueDate!,
      billedTo: this.clientObj?.clientId!,
      billedBy: this.businessObj?.businessId!,
    };

    this.apiService.createInvoice(invoiceDetail).subscribe({
      next: (value) => {
        if (value.code === 201) {
          for (let i = 0; i < this.itemName.length; i++) {
            const item = {
              itemName: this.itemName[i],
              quantity: this.quantity[i],
              rate: this.rate[i],
            };

            this.apiService.createInvoiceItems(item, value.data.invoiceId);
          }
          this.route.navigate(['/invoice']);
        }
      },
    });
  }
}
