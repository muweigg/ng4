import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './pages/home';
import { NoContentComponent } from './pages/404';

export const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
	{ path: 'home',  component: HomeComponent },
	{ path: '**',    component: NoContentComponent },
];

export const routing = RouterModule.forRoot(APP_ROUTES, {
    useHash: true,
    preloadingStrategy: PreloadAllModules
});
