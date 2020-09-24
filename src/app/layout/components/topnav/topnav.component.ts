import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { config } from 'src/assets/config';

@Component({
    selector: 'app-topnav',
    templateUrl: './topnav.component.html',
    styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent implements OnInit {
    public pushRightClass: string;
    showButton = true;
    userName;
    main_logo = config.main_logo;
   @Output('hideSideBar') hideBar: any = new EventEmitter<any>();
    constructor(public router: Router, private translate: TranslateService) {
        this.router.events.subscribe(val => {
            if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
                this.toggleSidebar();
            }

        });

        this.userName = localStorage.getItem('user_name');


    }

    ngOnInit() {
        this.pushRightClass = 'push-right';
        let url: any = new Array();
        url = this.router.url.split('/');
        const t: any = url.find(d => d === 'shop_detail');
        if (t) {
            this.showButton = false;
        }
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
        this.router.navigate(['/login']);
    }

    changeLang(language: string) {
        this.translate.use(language);
    }
}

