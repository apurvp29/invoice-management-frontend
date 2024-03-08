import { Component } from '@angular/core';
import { AsyncPipe, NgClass, NgIf, NgOptimizedImage } from "@angular/common";
import { AuthService } from "@auth0/auth0-angular";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    AsyncPipe,
    NgIf,
    NgClass
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(
    public authService: AuthService,
  ) {}

  logout() {
    this.authService.logout();
  }
}
