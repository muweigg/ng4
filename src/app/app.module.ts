import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from './app.routing';

import { DECLARATIONS } from './app.declarations';
import { AppComponent } from './app.component';

@NgModule({
	imports: [ BrowserModule, FormsModule, HttpModule, routing ],
	declarations: [ ...DECLARATIONS ],
	providers: [],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
