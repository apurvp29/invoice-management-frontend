import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
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
  authorization: string = 'Bearer ' + localStorage.getItem('token');
  header: HttpHeaders = new HttpHeaders().set(
    'authorization',
    this.authorization
  );
  downloadPdf(payload: object) {
    const url: string = `${baseUrl}pdf`;
    return this.http.post<{code: number, message: string, data: any}>(url, payload, { headers: this.header });
  }

  createClient(payload: CreateClientModel) {
    const url: string = `${baseUrl}client`;
    return this.http.post(url, payload, { headers: this.header });
  }

  sendMessageViaWhatsapp(invoiceNumber: string) {
    const url: string = `${baseUrl}message`;
    return this.http.post(url, { invoiceNumber: invoiceNumber }, { headers: this.header });
  }

  getBusiness(businessId: string) {
    const url: string = `${baseUrl}business/${businessId}`;
    return this.http.get<BusinessResponseModel>(url, { headers: this.header });
  }

  getClient(clientId: string) {
    const url: string = `${baseUrl}client/${clientId}`;
    return this.http.get<ClientResponseModel>(url, { headers: this.header });
  }

  getAllClients() {
    const url: string = `${baseUrl}client`;
    return this.http.get<ResponseModel>(url, { headers: this.header });
  }

  getBusinessDetails() {
    const url: string = `${baseUrl}business`;
    return this.http.get<ResponseModel>(url, { headers: this.header });
  }

  createInvoice(payloadInvoice: InvoiceModel) {
    const urlCreateInvoice: string = `${baseUrl}invoice`;
    return this.http.post<InvoiceResponseModel>(
      urlCreateInvoice,
      payloadInvoice,
      { headers: this.header }
    );
  }

  updateInvoice(data: any) {
    const { invoiceId, ...payload } = data;
    const url: string = `${baseUrl}invoice/${invoiceId}`;
    return this.http.put(url, payload, { headers: this.header });
  }

  createInvoiceItems(item: ItemsModel, invoiceId: string) {
    const urlCreateInvoiceItems: string = `${baseUrl}item/${invoiceId}`;
    this.http.post(urlCreateInvoiceItems, item, { headers: this.header }).subscribe({
      next: (value) => {},
      error: (err) => {},
    });
  }

  updateInvoiceItem(
    itemId: string,
    payload: { itemName: string; quantity: number; rate: number }
  ) {
    const url: string = `${baseUrl}item/${itemId}`;
    return this.http.put(url, payload, { headers: this.header });
  }

  deleteInvoiceItem(itemId: string) {
    const url: string = `${baseUrl}item/${itemId}`;
    return this.http.delete(url, { headers: this.header });
  }

  getAllInvoices() {
    const url: string = `${baseUrl}invoice`;
    return this.http.get<ResponseModel>(url, { headers: this.header });
  }

  deleteInvoice(invoiceId: string) {
    const url: string = `${baseUrl}invoice/${invoiceId}`;
    return this.http.delete(url, { headers: this.header });
  }

  getInvoiceDetail(invoiceId: string) {
    const url: string = `${baseUrl}invoice/detail/${invoiceId}`;
    return this.http.get<InvoiceDetailModel>(url, { headers: this.header });
  }

  createTaxes(invoiceId: string, payload: { taxName: string, taxPercentage: number }) {
    const url: string = `${baseUrl}tax/${invoiceId}`;
    this.http.post(url, payload, { headers: this.header }).subscribe({
      next: (value) => {},
      error: (err) => {},
    });
  }
}
