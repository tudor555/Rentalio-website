import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CookieUtil } from '../../services/cookie.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isMobileMenuOpen: boolean = false;
  currentUrl: string = '';
  isNavbarVisible: boolean = true;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  private lastScrollTop: number = 0;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  ngOnInit() {
    const userData = CookieUtil.getCookie('USER-DATA');
    if (userData) {
      this.isLoggedIn = true;
      try {
        const parsedUser = JSON.parse(userData);
        this.isAdmin = parsedUser.role === 'admin';
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > this.lastScrollTop && currentScroll > 100) {
      // Scrolling down
      this.isNavbarVisible = false;
    } else {
      // Scrolling up
      this.isNavbarVisible = true;
    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }
}
