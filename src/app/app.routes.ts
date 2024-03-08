import { Routes } from '@angular/router';
import { NestingComponent } from "./nesting-task/nesting/nesting.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ClientComponent} from "./client/client.component";
import {AddClientComponent} from "./add-client/add-client.component";

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: '', redirectTo: 'dashboard', pathMatch: "full"
  },
  {
    path: 'nesting',
    component: NestingComponent
  },
  {
    path: 'client',
    children: [
      {
        path: '',
        component: ClientComponent
      },
      {
        path: 'add-client',
        component: AddClientComponent
      },
    ],
  },
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
