import { Routes } from '@angular/router';

// Import your components
import { HomeComponent } from './pages/home/home.component';
import { RentalsComponent } from './pages/rentals/rentals-base/rentals-base.component';
import { RentalComponent } from './pages/rentals/rental/rental.component';
import { RentalListPropertyComponent } from './pages/rentals/rental-list-property/rental-list-property.component';
import { ReserveRentalComponent } from './pages/rentals/reserve-rental/reserve-rental.component';
import { FlightsComponent } from './pages/flights/flights-base/flights-base.component';
import { FlightsListComponent } from './pages/flights/flights-list/flight-list.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminComponent } from './pages/admin/admin-base/admin-base.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './pages/admin/admin-users/admin-users.component';
import { AdminRentalsComponent } from './pages/admin/admin-rentals/admin-rentals.component';
import { AdminReservationsComponent } from './pages/admin/admin-reservations/admin-reservations.component';
import { AdminReportsComponent } from './pages/admin/admin-reports/admin-reports.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { AuthComponent } from './pages/auth/auth-base/auth-base.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route
  { path: 'home', component: HomeComponent },
  { path: 'rentals', component: RentalsComponent },
  // Static before dynamic, don't move this above :id
  { path: 'rental/list-property', component: RentalListPropertyComponent },
  { path: 'rental/:id', component: RentalComponent },
  { path: 'rental/:id/reserve', component: ReserveRentalComponent },
  { path: 'flights', component: FlightsComponent },
  { path: 'flights/list', component: FlightsListComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'profile', component: ProfileComponent },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Default to dashboard
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'rentals', component: AdminRentalsComponent },
      { path: 'reservations', component: AdminReservationsComponent },
      { path: 'reports', component: AdminReportsComponent },
    ],
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' }, // Default to login
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
    ],
  },
  { path: '**', component: NotFoundComponent }, // Wildcard route for 404
];
