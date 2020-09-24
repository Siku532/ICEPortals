import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
export interface PeriodicElement {
  id:number,
  merchandiser_code:string,
  merchandiser_name:string,
  planned:number,
  completed:number,
  successfull:number,
  unsuccessful:number,
  unvisited:number,
  completed_percent:number,
  successful_percent:number
}
@Component({
  selector: 'app-mat-table',
  templateUrl: './mat-table.component.html',
  styleUrls: ['./mat-table.component.scss']
})
export class MatTableComponent implements OnInit,OnChanges {
  displayedColumns: string[] =  ['id','merchandiser_code','merchandiser_name','planned','completed','successfull','unsuccessful','unvisited','completed_percent','successful_percent'] 
  // ['id','merchandiser_name','Merchandiser Name','Planned','Productive','Successful','Un-Successful','Unvisited','Productivity','Successful'];
  dataSource:any=[];//PeriodicElement[];


  @Input('tableData') table:any;
  @ViewChild('MatSort') sort: MatSort;
  constructor() { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  

  ngOnChanges(sample:SimpleChanges){
    sample.first
console.log('input data',sample.table.currentValue)
let data:PeriodicElement=sample.table.currentValue
this.dataSource=new MatTableDataSource(sample.table.currentValue);  

  }

}
