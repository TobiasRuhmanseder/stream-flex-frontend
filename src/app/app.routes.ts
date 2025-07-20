import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './home/sign-in/sign-in.component';
import { LetsGoComponent } from './home/lets-go/lets-go.component';
import { SignUpComponent } from './home/sign-up/sign-up.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home/lets-go', pathMatch: 'full' },
    {
        path: 'home',
        component: HomeComponent,
        children: [
            { path: '', redirectTo: 'lets-go', pathMatch: 'full' }, // Default-Child-Redirect
            { path: 'lets-go', component: LetsGoComponent },
            { path: 'sign-in', component: SignInComponent },
            { path: 'sign-up', component: SignUpComponent },
        ]
    },
    { path: '**', redirectTo: 'home/lets-go' }
]
