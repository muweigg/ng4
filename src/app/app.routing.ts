import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './components';
import { PageNotFoundComponent } from './components';

export const APP_ROUTES: Routes = [
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent },
];

export const routing = RouterModule.forRoot(APP_ROUTES, {
    useHash: true,
    preloadingStrategy: PreloadAllModules
});
