import { enableProdMode }         from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule }              from './app/app.module';

declare var module;
if (module.hot) {
	module.hot.accept();
}

if (PROD_ENV) {
	enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
