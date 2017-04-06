import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    @ViewChild('nameList') nameList:ElementRef;
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
            this.nameList.nativeElement.focus();
        }
    }
}