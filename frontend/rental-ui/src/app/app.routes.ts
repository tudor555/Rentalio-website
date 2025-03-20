import { Routes } from '@angular/router';

// Import your components
import { HomeComponent } from './pages/home/home.component';
import { RentalsComponent } from './pages/rentals/rentals-base/rentals-base.component';
import { RentalComponent } from './pages/rentals/rental/rental.component';
import { FlightsComponent } from './pages/flights/flights-base/flights-base.component';
import { FlightComponent } from './pages/flights/flight/flight.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminComponent } from './pages/admin/admin-base/admin-base.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route
  { path: 'home', component: HomeComponent },
  // TODO: check if this match our needs
  { path: 'rentals', component: RentalsComponent,
    children: [
      { path: 'rental/:id', component: RentalComponent }, // Child route for rental details
    ],
   },
  // TODO: check if this is good or need to chanage
  {
    path: 'flights',
    component: FlightsComponent,
    children: [
      { path: 'flight', component: FlightComponent }, // Child route for flight details
    ],
  },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', component: NotFoundComponent }, // Wildcard route for 404
];
