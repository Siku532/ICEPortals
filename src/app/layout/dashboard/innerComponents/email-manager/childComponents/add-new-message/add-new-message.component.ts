import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'add-new-message',
  templateUrl: './add-new-message.component.html',
  styleUrls: ['./add-new-message.component.scss']
})
export class AddNewMessageComponent implements OnInit {

  minDate = new Date();
  maxDate = new Date(2025,0,1);
  startDate;

  timeSlots = [ ];

  populateTimeSlots(){

    for (let index = 1; index <= 24; index++) {
      let obj={
        value:index,
        viewValue:index+':00'
      }
      this.timeSlots.push(obj);
      
    }
  }

  showDatePicker=false;

  constructor() { 
    this.startDate=new Date();
    this.populateTimeSlots();
  }

  ngOnInit() {
  }

  toggleDatePicker(){
    this.showDatePicker=!this.showDatePicker;
  }

}
