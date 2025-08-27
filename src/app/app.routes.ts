import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './home/sign-in/sign-in.component';
import { LetsGoComponent } from './home/lets-go/lets-go.component';
import { SignUpComponent } from './home/sign-up/sign-up.component';
import { SignUpSuccessComponent } from './home/sign-up-success/sign-up-success.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { guestOnly } from './guards/guest-only.guard';
import { VerifyEmailComponent } from './home/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './home/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './home/reset-password/reset-password.component';
import { StartComponent } from './dashboard/start/start.component';
import { PlayerComponent } from './player/player.component';
import { SearchViewComponent } from './dashboard/search-view/search-view.component';
import { MyListComponent } from './dashboard/my-list/my-list.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { PrivacyComponent } from './privacy/privacy.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home/lets-go', pathMatch: 'full' },
    {
        path: 'home',
        component: HomeComponent,
        canMatch: [guestOnly],
        data: { animation: 'home' },
        children: [
            { path: '', redirectTo: 'lets-go', pathMatch: 'full' }, // Default-Child-Redirect
            { path: 'lets-go', component: LetsGoComponent },
            { path: 'sign-in', component: SignInComponent, },
            { path: 'sign-up', component: SignUpComponent },
            { path: 'sign-up-success', component: SignUpSuccessComponent },
            { path: 'verify-email', component: VerifyEmailComponent },
            { path: 'password-forgot', component: ForgotPasswordComponent },
            { path: 'password-reset', component: ResetPasswordComponent },
        ]
    },
    {
        path: 'dashboard', component: DashboardComponent, canActivate: [authGuard],
        data: { animation: 'dashboard' },
        children: [
            { path: '', redirectTo: 'start', pathMatch: 'full' }, // Default-Child-Redirect
            { path: 'start', component: StartComponent, data: { animation: 'start' } },
            { path: 'search-view', component: SearchViewComponent, data: { animation: 'search' } },
            { path: 'my-list', component: MyListComponent, data: { animation: 'mylist' } },
        ]
    },
    { path: 'player/:id', component: PlayerComponent, canActivate: [authGuard], data: { animation: 'player' }, },
    { path: 'impressum', component: ImpressumComponent, data: { animation: 'impressum' }, },
    { path: 'privacy', component: PrivacyComponent, data: { animation: 'privacy' }, },
    { path: '**', redirectTo: 'home/lets-go' }
]
