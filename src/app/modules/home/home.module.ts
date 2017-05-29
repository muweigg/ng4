import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeRoutingModule, homeRoutingComponent } from './home-routing.module';

@NgModule({
    declarations: [
        homeRoutingComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HomeRoutingModule,
    ],
    exports: [],
    providers: [],
    bootstrap: []
})
export class HomeModule {}