import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientComponent } from './client/client.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { AddClientComponent } from './add-client/add-client.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';
import { InvoiceNewComponent } from './invoice-o/invoice-new/invoice-new.component';
import { InvoiceCreateComponent } from './invoice-o/invoice-create/invoice-create.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'client',
    children: [
      {
        path: '',
        component: ClientComponent,
      },
      {
        path: 'add-client',
        component: AddClientComponent,
      },
    ],
  },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'create-invoice', component: InvoiceCreateComponent },
  {
    path: 'invoice',
    children: [
      {
        path: '',
        component: InvoiceComponent,
      },
      {
        path: 'edit-invoice',
        children: [
          {
            path: ':id',
            component: InvoiceCreateComponent,
          },
        ],
      },
      {
        path: 'view-invoice',
        children: [
          {
            path: ':id',
            component: InvoiceCreateComponent,
          },
        ],
      },
      {
        path: 'create-invoice',
        component: InvoiceCreateComponent,
      },
    ],
  },
  {
    path: 'invoice-o',
    children: [
      {
        path: '',
        component: InvoiceNewComponent,
      },
      {
        path: 'create-invoice',
        component: InvoiceCreateComponent,
      },
      {
        path: 'edit-invoice',
        children: [
          {
            path: ':id',
            component: InvoiceCreateComponent,
          },
        ],
      },
      {
        path: 'view-invoice',
        children: [
          {
            path: ':id',
            component: InvoiceCreateComponent,
          },
        ],
      },
    ],
  },
];
