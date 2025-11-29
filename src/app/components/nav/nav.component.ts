import { Component, OnInit, Input} from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent {
  @Input() isOpen = true;
  isNavbarVisible = false;

  dropdowns = {
    profile: false,
    notifications: false
  };

  constructor(private authService: AuthService) { }

  toggleNavbar(): void {
    this.isNavbarVisible = !this.isNavbarVisible;
  }

  toggleDropdown(menu: 'profile' | 'notifications'): void {
    this.dropdowns[menu] = !this.dropdowns[menu];
  }

  logout(): void {
    this.authService.logout();
  }
}

