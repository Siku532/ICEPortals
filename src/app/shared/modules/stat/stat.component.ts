import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-stat',
    templateUrl: './stat.component.html',
    styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {
    @Input() bgClass: string;
    @Input() icon: string;
    @Input() count: string;
    @Input() label: string;
    @Input() data: number;

    constructor(private router: Router) { }

    ngOnInit() { }

    goToProductivity() {
        // console.log('clicked')
        this.router.navigateByUrl('/dashboard/productivity_report')
    }
}
