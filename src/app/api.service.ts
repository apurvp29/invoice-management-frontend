import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../environment';
import { CreateClientModel } from '../model/CreateClientModel';
import { ResponseModel } from '../model/ResponseModel';
import { InvoiceModel } from '../model/InvoiceModel';
import { ItemsModel } from '../model/ItemsModel';
import { InvoiceResponseModel } from '../model/InvoiceResponseModel';
import { BusinessResponseModel } from '../model/BusinessResponseModel';
import { ClientResponseModel } from '../model/ClientResponseModel';
import { InvoiceDetailModel } from '../model/InvoiceDetailModel';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  downloadPdf(payload: object) {
    const url: string = `${baseUrl}pdf`;
    return this.http.post(url, payload);
  }

  createClient(payload: CreateClientModel) {
    const url: string = `${baseUrl}client`;
    return this.http.post(url, payload);
  }

  getBusiness(businessId: string) {
    const url: string = `${baseUrl}business/${businessId}`;
    return this.http.get<BusinessResponseModel>(url);
  }

  getClient(clientId: string) {
    const url: string = `${baseUrl}client/${clientId}`;
    return this.http.get<ClientResponseModel>(url);
  }

  getAllClients() {
    const url: string = `${baseUrl}client`;
    return this.http.get<ResponseModel>(url);
  }

  getBusinessDetails() {
    const url: string = `${baseUrl}business`;
    return this.http.get<ResponseModel>(url);
  }

  createInvoice(payloadInvoice: InvoiceModel) {
    const urlCreateInvoice: string = `${baseUrl}invoice`;
    return this.http.post<InvoiceResponseModel>(
      urlCreateInvoice,
      payloadInvoice
    );
  }

  updateInvoice(data: any) {
    const { invoiceId, ...payload } = data;
    const url: string = `${baseUrl}invoice/${invoiceId}`;
    return this.http.put(url, payload);
  }

  createInvoiceItems(item: ItemsModel, invoiceId: string) {
    const urlCreateInvoiceItems: string = `${baseUrl}item/${invoiceId}`;
    this.http.post(urlCreateInvoiceItems, item).subscribe({
      next: (value) => {},
      error: (err) => {},
    });
  }

  updateInvoiceItem(
    itemId: string,
    payload: { itemName: string; quantity: number; rate: number }
  ) {
    const url: string = `${baseUrl}item/${itemId}`;
    return this.http.put(url, payload);
  }

  deleteInvoiceItem(itemId: string) {
    const url: string = `${baseUrl}item/${itemId}`;
    return this.http.delete(url);
  }

  getAllInvoices() {
    const url: string = `${baseUrl}invoice`;
    return this.http.get<ResponseModel>(url);
  }

  deleteInvoice(invoiceId: string) {
    const url: string = `${baseUrl}invoice/${invoiceId}`;
    return this.http.delete(url);
  }

  getInvoiceDetail(invoiceId: string) {
    const url: string = `${baseUrl}invoice/detail/${invoiceId}`;
    return this.http.get<InvoiceDetailModel>(url);
  }
}
