import { Component, OnInit, Input} from '@angular/core';

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

  toggleNavbar(): void {
    this.isNavbarVisible = !this.isNavbarVisible;
  }

  toggleDropdown(menu: 'profile' | 'notifications'): void {
    this.dropdowns[menu] = !this.dropdowns[menu];
  }
}

