import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientComponent } from './client/client.component';
import { AddClientComponent } from './add-client/add-client.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
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
      {
        path: 'edit-client',
        children: [
          {
            path: ':id',
            component: AddClientComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'invoice',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../app/invoice/invoice.component').then(
            (m) => m.InvoiceComponent
          ),
      },
      {
        path: 'edit-invoice',
        children: [
          {
            path: ':id',
            loadComponent: () =>
              import(
                '../app/invoice-o/invoice-create/invoice-create.component'
              ).then((m) => m.InvoiceCreateComponent),
          },
        ],
      },
      {
        path: 'view-invoice',
        children: [
          {
            path: ':id',
            loadComponent: () =>
              import(
                '../app/invoice-o/invoice-create/invoice-create.component'
              ).then((m) => m.InvoiceCreateComponent),
          },
        ],
      },
      {
        path: 'create-invoice',
        loadComponent: () =>
          import(
            '../app/invoice-o/invoice-create/invoice-create.component'
          ).then((m) => m.InvoiceCreateComponent),
      },
    ],
  },
];
