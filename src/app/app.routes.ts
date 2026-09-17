import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGaurd } from './shared/gaurds/auth.gaurd';
import { AuthLayoutComponent } from './shared/components/auth-layout/auth-layout.component';
import { SignupComponent } from './signup/signup.component';
import { redirectIfAuthenticatedGuard } from './shared/gaurds/redirect.gaurd';
import { TripDetailComponent } from './trip-detail/trip-detail.component';
import { NewTripComponent } from './new-trip/new-trip.component';

export const routes: Routes = [
    {
        path: '',
        component: LandingComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'app',
        component: AuthLayoutComponent,
        canActivate: [AuthGaurd],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'trips/:tripId', component: TripDetailComponent},
            { path: 'new-trip', component: NewTripComponent }
        ]
    }, 
    {
        path: 'signup',
        component: SignupComponent,
        canActivate: [redirectIfAuthenticatedGuard]
    }
];