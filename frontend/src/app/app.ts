import { Component, signal } from '@angular/core';
// 1. Verifique se CommonModule e Router estão importados
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, // <-- Importante para o *ngIf
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('korp-frontend');

  // 2. Verifique se o signal existe
  currentUrl = signal('');

  // 3. Verifique se o Router está injetado
  constructor(private router: Router) {}

  // 4. Verifique se ESTE MÉTODO existe
  onRouteActivate(event: any) {
    this.currentUrl.set(this.router.url);
  }
}