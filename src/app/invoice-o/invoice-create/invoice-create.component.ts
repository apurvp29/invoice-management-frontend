import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgForOf, NgIf, NgStyle } from '@angular/common';
import { ApiService } from '../../api.service';
import { BusinessModel } from '../../../model/BusinessModel';
import { ClientModel } from '../../../model/ClientModel';
import { InvoiceModel } from '../../../model/InvoiceModel';
import { ItemsModel } from '../../../model/ItemsModel';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceDetailModel } from '../../../model/InvoiceDetailModel';
import { InvoiceDataModel } from '../../../model/InvoiceDataModel';

@Component({
  selector: 'app-invoice-create',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, NgForOf, NgStyle],
  templateUrl: './invoice-create.component.html',
  styleUrl: './invoice-create.component.css',
})
export class InvoiceCreateComponent implements OnInit {
  basicInformationInvoice: FormGroup;
  isAllValid: boolean = false;
  showInvalidNumber: boolean = false;
  allInvoices: [] = [];
  allClients: ClientModel[] = [];
  clientObj: ClientModel | undefined;
  businessObj: BusinessModel | undefined;
  currentInvoiceDetail: InvoiceDetailModel | undefined;
  invoiceId: string = '';
  itemsId: string[] = [];
  totalAmount: number = 0;
  currentInvoice: InvoiceDataModel | undefined;
  viewOnly: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: ActivatedRoute,
    private route: Router
  ) {
    this.basicInformationInvoice = fb.group({
      invoiceNumber: ['', [Validators.required]],
      invoiceDate: ['', Validators.required],
      dueDate: ['', Validators.required],
      selectClient: ['', Validators.required],
      items: fb.array([], Validators.required),
    });
  }

  ngOnInit(): void {
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
              next: (val) => {
                this.currentInvoiceDetail = val;
                for (
                  let i = 0;
                  i < this.currentInvoiceDetail.data.itemsInvoice.length;
                  i++
                ) {
                  this.fArray.push(
                    this.fb.group({
                      itemName: [
                        this.currentInvoiceDetail.data.itemsInvoice[i].itemName,
                        Validators.required,
                      ],
                      quantity: [
                        this.currentInvoiceDetail.data.itemsInvoice[i].quantity,
                        [Validators.required, Validators.pattern('[0-9]*')],
                      ],
                      rate: [
                        this.currentInvoiceDetail.data.itemsInvoice[i].rate,
                        [Validators.required, Validators.pattern('[0-9]*')],
                      ],
                    })
                  );
                  this.itemsId[i] =
                    this.currentInvoiceDetail.data.itemsInvoice[
                      i
                    ].invoiceItemsId;
                }
                this.totalAmount = this.currentInvoiceDetail.data.totalAmount;
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
            this.f.get('selectClient')?.disable();
          }
        });
        this.router.queryParams.subscribe((query) => {
          this.viewOnly = query['view'];
        });
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  checkValidInvoiceNumber() {
    for (let invoice of this.allInvoices) {
      if (
        this.basicInformationInvoice.value['invoiceNumber'] ===
        invoice['invoiceNumber']
      ) {
        this.showInvalidNumber = true;
        break;
      } else {
        this.showInvalidNumber = false;
      }
    }
  }

  onSelectClient() {
    for (let client of this.allClients) {
      if (
        client['clientId'] ===
        this.basicInformationInvoice.value['selectClient']
      ) {
        this.clientObj = client;
        break;
      }
    }
  }

  onAddItem() {
    this.fArray.push(
      this.fb.group({
        itemName: ['', Validators.required],
        quantity: ['', [Validators.required, Validators.pattern('[0-9]*')]],
        rate: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      })
    );
  }

  updateAmount() {
    this.totalAmount = 0;
    for (let i = 0; i < this.fArray.length; i++) {
      this.totalAmount +=
        Number(this.fArray.value[i]['quantity']) *
        Number(this.fArray.value[i]['rate'])
          ? Number(this.fArray.value[i]['quantity']) *
            Number(this.fArray.value[i]['rate'])
          : 0;
    }
  }

  get fArray() {
    return <FormArray>this.basicInformationInvoice.controls['items'];
  }

  fGroup(index: number) {
    return (this.basicInformationInvoice.get('items') as FormArray).controls[
      index
    ] as FormGroup;
  }

  get f() {
    return this.basicInformationInvoice;
  }

  onRemoveItem(index: number) {
    this.fArray.removeAt(index);
    if (this.invoiceId) {
      this.itemsId.splice(index, 1);
    }
  }

  onUpdate() {
    const payload = {
      invoiceId: this.invoiceId,
      invoiceDate: this.f.get('invoiceDate')?.value
        ? new Date(this.f.get('invoiceDate')?.value)
        : new Date(this.currentInvoice!.invoiceDate),
      dueDate: this.f.get('dueDate')?.value
        ? new Date(this.f.get('dueDate')?.value)
        : new Date(this.currentInvoice!.dueDate),
    };
    this.apiService.updateInvoice(payload).subscribe({
      next: (value) => {
        for (let i = 0; i < this.itemsId.length; i++) {
          const itemPayload = {
            itemName: this.fArray.value[i]['itemName'],
            quantity: Number(this.fArray.value[i]['quantity']),
            rate: Number(this.fArray.value[i]['rate']),
          };
          this.apiService
            .updateInvoiceItem(this.itemsId[i], itemPayload)
            .subscribe({
              next: (val) => {},
            });
        }

        for (
          let i = 0;
          i < this.currentInvoiceDetail!.data.itemsInvoice.length;
          i++
        ) {
          let isPresent: boolean = false;
          for (let j = 0; j < this.itemsId.length; j++) {
            if (
              this.itemsId[j] ===
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

        for (let i = this.itemsId.length; i < this.fArray.length; i++) {
          const payloadInvoiceItem = {
            itemName: this.fArray.value[i]['itemName'],
            quantity: Number(this.fArray.value[i]['quantity']),
            rate: Number(this.fArray.value[i]['rate']),
          };
          this.apiService.createInvoiceItems(
            payloadInvoiceItem,
            this.invoiceId
          );
        }
      },
    });
  }

  onSubmit() {
    if (
      this.f.controls['invoiceNumber'].errors?.['required'] ||
      this.f.controls['invoiceDate'].errors?.['required'] ||
      this.f.controls['dueDate'].errors?.['required'] ||
      this.f.controls['selectClient'].errors?.['required'] ||
      this.f.controls['items'].errors?.['required']
    ) {
      this.isAllValid = true;
      return;
    }

    const invoiceDetail: InvoiceModel = {
      invoiceNumber: this.f.value['invoiceNumber'],
      invoiceDate: this.f.value['invoiceDate'],
      dueDate: this.f.value['dueDate'],
      billedTo: this.f.value['selectClient'],
      billedBy: this.businessObj?.businessId!,
    };

    this.apiService.createInvoice(invoiceDetail).subscribe({
      next: (value) => {
        if (value.code === 201) {
          this.fArray.value.forEach((val: ItemsModel) => {
            const item: ItemsModel = {
              itemName: val.itemName,
              quantity: val.quantity,
              rate: val.rate,
            };
            this.apiService.createInvoiceItems(item, value.data.invoiceId);
          });
          this.route.navigate(
            [`/invoice/view-invoice/${value.data.invoiceId}`],
            { queryParams: { view: true } }
          );
        }
      },
    });
  }

  onDownload() {
    const items: {
      name: string;
      quantity: number;
      rate: number;
      amount: number;
    }[] = [];
    this.currentInvoiceDetail?.data.itemsInvoice.forEach((item) => {
      items.push({
        name: item.itemName,
        quantity: item.quantity,
        rate: item.rate,
        amount: Number(item.quantity) * Number(item.rate),
      });
    });
    const payload: object = {
      invoiceNumber: this.currentInvoiceDetail?.data.invoiceNumber,
      invoiceDate: this.currentInvoiceDetail?.data.invoiceDate.substring(0, 10),
      dueDate: this.currentInvoiceDetail?.data.invoiceDueDate.substring(0, 10),
      clientName: this.currentInvoiceDetail?.data.clientName,
      clientEmail: this.currentInvoiceDetail?.data.clientEmail,
      clientPhone: this.clientObj?.phone,
      items: items,
      totalAmount: this.currentInvoiceDetail?.data.totalAmount,
    };
    this.apiService.downloadPdf(payload).subscribe({
      next: (value) => {},
      error: (err) => {},
    });
  }

  protected readonly Number = Number;
}
