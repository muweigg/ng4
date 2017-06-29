import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'home',
    template: `
        <h1>
            {{ title }}
            <br>
            this is a lazy load module.
        </h1>
    `
})
export class HomeComponent implements OnInit {

    title: String = "app works!";

    constructor() { }

    ngOnInit() { }
    
}