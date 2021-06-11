import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-productivity',
  templateUrl: './productivity.component.html',
  styleUrls: ['./productivity.component.scss']
})
export class ProductivityComponent implements OnInit {
  title = '';
 
  constructor(public router: Router) { 
    if(this.router.url=='/dashboard/supervisor_productivity'){
      this.title="Supervisor Productivity";
    }
    else
    {
      this.title="Merchandiser Productivity";
    }
  }

  ngOnInit() {
  }

  

}
