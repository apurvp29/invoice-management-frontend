import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ActionService {
  visibilitySubject = new Subject<boolean>();
  deleteInvoiceId = new Subject<string>();
  editInvoice = new Subject<string>();
}
