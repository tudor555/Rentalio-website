import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, NavbarComponent, FooterComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'rental-ui';
  hideFooter: boolean = false;

  constructor(private router: Router, private activateRoute: ActivatedRoute) {
    this.router.events.subscribe(() => {
      const currentRoute = this.router.url;
      this.hideFooter =
        currentRoute.includes('/auth') ||
        currentRoute.includes('/auth/login') ||
        currentRoute.includes('/auth/signup');
    });
  }
}
