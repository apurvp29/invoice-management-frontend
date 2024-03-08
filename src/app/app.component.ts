import {Component, OnDestroy, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';

import { LayoutComponent } from './shared/layout/layout.component';
import {AsyncPipe, NgIf} from "@angular/common";
import {AuthService} from "@auth0/auth0-angular";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent, AsyncPipe, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'invoice-frontend';
  isAuthenticated: boolean = true;
  constructor(private authService: AuthService) {
    this.authService.isAuthenticated$.subscribe(value => {
      this.isAuthenticated = value;
    })
    this.authService.getAccessTokenSilently().subscribe((token: any) => {
      localStorage.setItem("token", token);
    })
  }

  login() {
    this.authService.loginWithRedirect();
  }

  ngOnInit(): void {
    initFlowbite();
  }

  ngOnDestroy(): void {
  }
}
