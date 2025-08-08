import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './home/sign-in/sign-in.component';
import { LetsGoComponent } from './home/lets-go/lets-go.component';
import { SignUpComponent } from './home/sign-up/sign-up.component';
import { SignUpSuccessComponent } from './home/sign-up-success/sign-up-success.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './app/guards/auth.guard';
import { guestOnly } from './app/guards/guest-only.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home/lets-go', pathMatch: 'full' },
    {
        path: 'home',
        component: HomeComponent,
        canMatch: [guestOnly],
        children: [
            { path: '', redirectTo: 'lets-go', pathMatch: 'full' }, // Default-Child-Redirect
            { path: 'lets-go', component: LetsGoComponent },
            { path: 'sign-in', component: SignInComponent },
            { path: 'sign-up', component: SignUpComponent },
            { path: 'sign-up-success', component: SignUpSuccessComponent },
        ]
    },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: 'home/lets-go' }
]
