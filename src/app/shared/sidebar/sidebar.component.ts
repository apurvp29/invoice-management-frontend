import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {NgOptimizedImage, NgStyle} from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
    imports: [RouterLink, RouterLinkActive, NgStyle, NgOptimizedImage],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
}
