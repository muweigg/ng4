import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from './app.routing';

import { AppComponent } from './app.component';
import { HomeComponent } from './components';
import { PageNotFoundComponent } from './components';

@NgModule({
	imports: [ BrowserModule, FormsModule, HttpModule, routing ],
	declarations: [
		AppComponent,
		PageNotFoundComponent,
		HomeComponent
	],
	providers: [],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
