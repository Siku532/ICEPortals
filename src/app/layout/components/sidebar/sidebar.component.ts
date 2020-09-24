import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    public showMenu: string;
    menuList: any=[];
    value: any=1;
    constructor(public router: Router) {}
    toggleValue = true;
    toggleValueDashboard=true;

    ngOnInit() {
        this.showMenu = '';
        this.menuList=JSON.parse(localStorage.getItem('menu'))
        console.log(this.menuList,'menu List')
    }

    getIndex(i){
        console.log(i)
        this.value= i;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }
}
