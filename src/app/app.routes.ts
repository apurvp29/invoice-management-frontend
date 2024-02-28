import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'client',
    children: [
      {
        path: '',
        loadComponent: () => import('../app/client/client.component').then(m => m.ClientComponent)
      },
      {
        path: 'add-client',
        loadComponent: () => import('../app/add-client/add-client.component').then(m => m.AddClientComponent)
      },
    ],
  },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'invoice',
    children: [
      {
        path: '',
        loadComponent: () => import('../app/invoice/invoice.component').then(m => m.InvoiceComponent)
      },
      {
        path: 'edit-invoice',
        children: [
          {
            path: ':id',
            loadComponent: () => import('../app/invoice-o/invoice-create/invoice-create.component').then(m => m.InvoiceCreateComponent)
          },
        ],
      },
      {
        path: 'view-invoice',
        children: [
          {
            path: ':id',
            loadComponent: () => import('../app/invoice-o/invoice-create/invoice-create.component').then(m => m.InvoiceCreateComponent)
          },
        ],
      },
      {
        path: 'create-invoice',
        loadComponent: () => import('../app/invoice-o/invoice-create/invoice-create.component').then(m => m.InvoiceCreateComponent)
      },
    ],
  },

];
