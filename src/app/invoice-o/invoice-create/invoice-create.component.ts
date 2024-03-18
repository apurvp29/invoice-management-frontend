import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AsyncPipe,
  NgForOf,
  NgIf,
  NgOptimizedImage,
  NgStyle,
} from '@angular/common';
import { ApiService } from '../../api.service';
import { BusinessModel } from '../../../model/BusinessModel';
import { ClientModel } from '../../../model/ClientModel';
import { InvoiceModel } from '../../../model/InvoiceModel';
import { ItemsModel } from '../../../model/ItemsModel';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { InvoiceDetailModel } from '../../../model/InvoiceDetailModel';
import { InvoiceDataModel } from '../../../model/InvoiceDataModel';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-invoice-create',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    NgStyle,
    NgOptimizedImage,
    LottieComponent,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
  ],
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
  isDownloading = new BehaviorSubject(false);
  invoiceId: string = '';
  itemsId: string[] = [];
  taxId: string[] = [];
  totalAmount: number = 0;
  subTotalAmount: number = 0;
  currentInvoice: InvoiceDataModel | undefined;
  viewOnly: boolean = false;
  options: AnimationOptions = {
    path: 'assets/loading-fb.json',
  };
  showMessage: string = '';

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
      taxes: fb.array([], Validators.required),
    });
  }

  ngOnInit(): void {
    this.apiService.getAllClients().subscribe({
      next: (value) => {
        this.allClients = value.data;
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
                            this.currentInvoiceDetail.data.itemsInvoice[i]
                              .itemName,
                            Validators.required,
                          ],
                          quantity: [
                            this.currentInvoiceDetail.data.itemsInvoice[i]
                              .quantity,
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
                    for (
                      let i = 0;
                      i < this.currentInvoiceDetail?.data.taxInvoice.length;
                      i++
                    ) {
                      this.fArrayTaxes.push(
                        this.fb.group({
                          taxName: [
                            this.currentInvoiceDetail?.data.taxInvoice[i]
                              .taxName,
                            Validators.required,
                          ],
                          taxPercentage: [
                            this.currentInvoiceDetail?.data.taxInvoice[i]
                              .taxPercentage,
                            Validators.required,
                          ],
                        })
                      );
                      this.taxId[i] =
                        this.currentInvoiceDetail.data.taxInvoice[
                          i
                        ].invoiceTaxId;
                    }
                    this.totalAmount = Number(
                      this.currentInvoiceDetail.data.totalAmount
                    );
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
      },
    });

    this.apiService.getBusinessDetails().subscribe({
      next: (value) => {
        value.data.forEach((business: BusinessModel) => {
          this.businessObj = business;
        });
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

  navigateToEditClient() {
    this.route
      .navigate([`/client/edit-client/${this.clientObj?.clientId}`])
      .then((r) => {});
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

  onAddTaxes() {
    this.fArrayTaxes.push(
      this.fb.group({
        taxName: ['', Validators.required],
        taxPercentage: ['', Validators.required],
      })
    );
  }

  updateAmount() {
    this.subTotalAmount = 0;
    for (let i = 0; i < this.fArray.length; i++) {
      this.subTotalAmount +=
        Number(this.fArray.value[i]['quantity']) *
        Number(this.fArray.value[i]['rate'])
          ? Number(this.fArray.value[i]['quantity']) *
            Number(this.fArray.value[i]['rate'])
          : 0;
    }
    this.totalAmount = 0;
    this.totalAmount += this.subTotalAmount;
    for (let i = 0; i < this.fArrayTaxes.length; i++) {
      this.totalAmount += Number(this.fArrayTaxes.value[i]['taxPercentage'])
        ? (this.subTotalAmount / 100) *
          Number(this.fArrayTaxes.value[i]['taxPercentage'])
        : 0;
    }
  }

  get fArray() {
    return <FormArray>this.basicInformationInvoice.controls['items'];
  }

  get fArrayTaxes() {
    return <FormArray>this.basicInformationInvoice.controls['taxes'];
  }

  fGroupTaxes(index: number) {
    return (this.basicInformationInvoice.get('taxes') as FormArray).controls[
      index
    ] as FormGroup;
  }

  fGroup(index: number) {
    return (this.basicInformationInvoice.get('items') as FormArray).controls[
      index
    ] as FormGroup;
  }

  get f() {
    return this.basicInformationInvoice;
  }

  formatDate(date: string) {
    const months: string[] = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ];
    let parts = date.split('-');
    const formattedDate: string = `${months[Number(parts[1]) - 1]} ${
      parts[0]
    }, ${parts[2]}`;
    return formattedDate;
  }

  onRemoveItem(index: number) {
    this.fArray.removeAt(index);
    {
      if (this.invoiceId) {
        this.itemsId.splice(index, 1);
      }
    }
    this.updateAmount();
  }

  onRemoveTax(index: number) {
    this.fArrayTaxes.removeAt(index);
    {
      if (this.invoiceId) {
        this.taxId.splice(index, 1);
      }
    }
    this.updateAmount();
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

        for (let i = 0; i < this.taxId.length; i++) {
          const taxPayload = {
            taxName: this.fArrayTaxes.value[i]['taxName'],
            taxPercentage: Number(this.fArrayTaxes.value[i]['taxPercentage']),
          };
          this.apiService.updateTaxes(this.taxId[i], taxPayload).subscribe({
            next: (taxVal) => {},
          });
        }

        for (
          let i = 0;
          i < this.currentInvoiceDetail!.data.taxInvoice.length;
          i++
        ) {
          let isTaxPresent: boolean = false;
          for (let j = 0; j < this.taxId.length; j++) {
            if (
              this.taxId[j] ===
              this.currentInvoiceDetail!.data.taxInvoice[i].invoiceTaxId
            ) {
              isTaxPresent = true;
              break;
            }
          }

          if (!isTaxPresent) {
            this.apiService
              .deleteTaxes(
                this.currentInvoiceDetail!.data.taxInvoice[i].invoiceTaxId
              )
              .subscribe({
                next: (tax) => {},
              });
          }
        }

        for (let i = this.taxId.length; i < this.fArrayTaxes.length; i++) {
          const payload = {
            taxName: this.fArrayTaxes.value[i]['taxName'],
            taxPercentage: this.fArrayTaxes.value[i]['taxPercentage'],
          };
          this.apiService.createTaxes(this.invoiceId, payload);
        }

        this.route
          .navigate([`/invoice/view-invoice/${this.invoiceId}`], {
            queryParams: { view: true },
          })
          .then((r) => {});
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
          this.fArrayTaxes.value.forEach((tax: any) => {
            const payload = {
              taxName: tax['taxName'],
              taxPercentage: Number(tax['taxPercentage']),
            };
            this.apiService.createTaxes(value.data.invoiceId, payload);
          });
          this.route
            .navigate([`/invoice/view-invoice/${value.data.invoiceId}`], {
              queryParams: { view: true },
            })
            .then((r) => {});
        }
      },
    });
  }

  navigateToEdit() {
    this.route
      .navigate([`/invoice/edit-invoice/${this.invoiceId}`])
      .then((r) => {});
  }

  getPayload() {
    const items: {
      name: string;
      quantity: number;
      rate: number;
      amount: number;
    }[] = [];

    const taxes: {
      taxName: string;
      taxPercentage: number;
    }[] = [];

    this.currentInvoiceDetail?.data.itemsInvoice.forEach((item) => {
      items.push({
        name: item.itemName,
        quantity: item.quantity,
        rate: item.rate,
        amount: Number(item.quantity) * Number(item.rate),
      });
    });
    this.currentInvoiceDetail?.data.taxInvoice.forEach((tax) => {
      taxes.push({
        taxName: tax.taxName,
        taxPercentage: tax.taxPercentage,
      });
    });
    const payload: object = {
      businessName: this.currentInvoiceDetail?.data.businessName,
      invoiceNumber: this.currentInvoiceDetail?.data.invoiceNumber,
      invoiceDate: this.formatDate(
        this.currentInvoiceDetail?.data.invoiceDate.substring(0, 10)!
      ),
      dueDate: this.formatDate(
        this.currentInvoiceDetail?.data.invoiceDueDate.substring(0, 10)!
      ),
      businessGST: this.currentInvoiceDetail?.data.businessGST,
      businessPAN: this.currentInvoiceDetail?.data.businessPan,
      clientGST: this.currentInvoiceDetail?.data.clientGST,
      clientPAN: this.currentInvoiceDetail?.data.clientPAN,
      clientName: this.currentInvoiceDetail?.data.clientName,
      clientEmail: this.currentInvoiceDetail?.data.clientEmail,
      clientPhone: this.clientObj?.phone,
      clientStreetAddress: this.currentInvoiceDetail?.data.clientStreetAddress,
      clientCity: this.currentInvoiceDetail?.data.clientCity,
      clientState: this.currentInvoiceDetail?.data.clientState,
      clientCountry: this.currentInvoiceDetail?.data.clientCountry,
      clientPincode: this.currentInvoiceDetail?.data.clientPincode,
      items: items,
      taxes: taxes,
      totalAmount: this.totalAmount,
    };
    return payload;
  }

  onDownload() {
    this.showMessage = 'Downloading📥, Please wait.';
    this.isDownloading.next(true);
    const payload = this.getPayload();
    this.apiService.downloadPdf(payload).subscribe({
      next: (value: { code: number; message: string; data: any }) => {
        if (this.currentInvoiceDetail) {
          this.apiService
            .sendMessageViaWhatsapp(
              this.currentInvoiceDetail.data.invoiceNumber,
              true
            )
            .subscribe({
              next: (value) => {
                this.isDownloading.next(false);
                window.open(value.data, '_blank');
              },
            });
        }
      },
      error: (err) => {},
    });
  }

  sendMessage() {
    this.showMessage = 'Sending📤, Please wait.';
    this.isDownloading.next(true);
    const payload = this.getPayload();
    this.apiService.downloadPdf(payload).subscribe({
      next: (value: { code: number; message: string; data: any }) => {
        if (this.currentInvoiceDetail) {
          this.apiService
            .sendMessageViaWhatsapp(
              this.currentInvoiceDetail.data.invoiceNumber
            )
            .subscribe({
              next: (value) => {
                this.isDownloading.next(false);
              },
            });
        }
      },
      error: (err) => {},
    });
  }

  protected readonly Number = Number;
}
