import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-root',
    encapsulation: ViewEncapsulation.None,
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})

export class AppComponent implements OnInit {
    
    constructor() { }

    ngOnInit() {
        PROD_ENV || console.log('is ready.');
    }
}