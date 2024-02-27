import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';

import { LayoutComponent } from './shared/layout/layout.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { ConfirmComponent } from './confirm/confirm.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent, AsyncPipe, NgIf, ConfirmComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'invoice-frontend';

  ngOnInit(): void {
    initFlowbite();
  }
}
