import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

    @ViewChild('nameInput') nameInput:ElementRef;
    title:String = "ng4-start";
    names:Array<any> = [];
    name:String = "";

    constructor() { }

    ngOnInit() { }

    addItem() {
        console.log(this.name);
        if (this.name.length > 0) {
            this.names.push(this.name);
            this.name = '';
            this.nameInput.nativeElement.focus();
        }
    }
}