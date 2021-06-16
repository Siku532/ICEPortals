import {
  Component,
  OnInit,
  AfterViewChecked,
  Input,
  ViewChild,
  Output, EventEmitter
} from "@angular/core";
import { DashboardService } from "../../../dashboard.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-update-vd-planograms',
  templateUrl: './update-vd-planograms.component.html',
  styleUrls: ['./update-vd-planograms.component.scss']
})
export class UpdateVdPlanogramsComponent implements OnInit {
  @Input('planogramList') planogramList;
  @Input('selectedChiller') selectedChiller;
  ip="http://nflm.rtdtradetracker.com";

  loading:boolean;
  updatedPlanogramList:any=[];

  constructor(private toastr: ToastrService,
    private httpService: DashboardService,
    public router: Router) { }

  ngOnInit() {
  }

  assignPlanograms(event, item) {
    const obj={
      id: item.id,
      chillerId: this.selectedChiller.id,
      active: event.checked? 'Y': 'N',
    }
    const i = this.updatedPlanogramList.findIndex((p) => p.id == item.id && p.chillerId==this.selectedChiller.id);
    if(i>-1){
      this.updatedPlanogramList.splice(i,1, obj);
    }
    else{
      this.updatedPlanogramList.push(obj);
    }
    console.log(this.updatedPlanogramList)
}

updateChillerPlanograms() {
  this.loading=true;
  const obj={
    planogramList: this.updatedPlanogramList,
  }
  this.httpService.updateChillerPlanograms(obj).subscribe(
    (data:any) => {
      if (data.success) {
        this.toastr.success('Planograms Updated Successfully');
        this.updatedPlanogramList=[];
      }
      else
      {
        this.toastr.error('There was an error updating the product');
      }
      this.loading=false;
    },
    (error) => {
      error.status === 0
        ? this.toastr.error("Please check Internet Connection", "Error")
        : this.toastr.error(error.description, "Error");
    }
  );
}

}


