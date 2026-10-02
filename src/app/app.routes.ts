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
import { GenerateTripComponent } from './generate-trip/generate-trip.component';
import { SharedTripComponent } from './shared-trip/shared-trip.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

export const routes: Routes = [
    {
        path: '',
        component: LandingComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [redirectIfAuthenticatedGuard],
    },
    {
        path: 'app',
        component: AuthLayoutComponent,
        canActivate: [AuthGaurd],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'trips/:tripId', component: TripDetailComponent },
            { path: 'new-trip', component: NewTripComponent },
            { path: 'generate', component: GenerateTripComponent },
        ],
    },
    { path: 'shared/trips/:shareToken', component: SharedTripComponent },
    {
        path: 'signup',
        component: SignupComponent,
        canActivate: [redirectIfAuthenticatedGuard],
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [redirectIfAuthenticatedGuard],
    },
    { path: 'reset-password', component: ResetPasswordComponent },
    {
        path: 'guides',
        loadComponent: () =>
            import('./shared/components/guides/guides-list/guides-list.component').then(
                (m) => m.GuidesListComponent,
            ),
    },
    {
        path: 'guides/:slug',
        loadComponent: () =>
            import('./shared/components/guides/guide-detail/guide-detail.component').then(
                (m) => m.GuideDetailComponent,
            ),
    },
];
