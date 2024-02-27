import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable({ providedIn: 'root' })
export class DeleteService {
  visibilitySubject = new Subject<boolean>();
  deleteInvoiceId = new Subject<string>();
}
