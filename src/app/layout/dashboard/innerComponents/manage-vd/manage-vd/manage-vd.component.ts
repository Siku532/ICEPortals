import {
  Component,
  OnInit,
  AfterViewChecked,
  Input,
  ViewChild,
} from "@angular/core";
import { DashboardService } from "../../../dashboard.service";
import { DashboardDataService } from "../../../dashboard-data.service";
import { Router } from "@angular/router";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ModalDirective } from "ngx-bootstrap";

@Component({
  selector: 'app-manage-vd',
  templateUrl: './manage-vd.component.html',
  styleUrls: ['./manage-vd.component.scss']
})
export class ManageVdComponent implements OnInit {
  chillerList:any=[];
  channelList:any=[];
  selectedChiller:any={};
  selectedChannel:any={};

  chillerProductList:any=[];

  loadingData:boolean;
  loading: boolean;
  loadingModalButton: boolean;

  isUpdateRequest:boolean;
  operationType='';
  ip="http://nflm.rtdtradetracker.com";

planogramList:any=[];

  @ViewChild("childModal") childModal: ModalDirective;

  form: FormGroup;

  constructor( private toastr: ToastrService,
    private httpService: DashboardService,
    public router: Router,
    public formBuilder: FormBuilder) { 
    this.channelList=JSON.parse(localStorage.getItem('channelList'));
    this.form = formBuilder.group({
      id: new FormControl(""),
      title: new FormControl("", [Validators.required]),
      channelId: new FormControl("", [Validators.required]),
      codeVerification: new FormControl("", [Validators.required])
    });
  }

  ngOnInit() {

  }

  getChillerList() {
    this.loadingData=true;
    this.httpService.getChillerList(this.selectedChannel.id || -1).subscribe(
      (data) => {
        if (data) {
          this.chillerList = data;
          const i = this.chillerList.findIndex((p) => p.id == this.selectedChiller.id);
          if(i>-1){
            this.selectedChiller=this.chillerList[i];
          }
          else{
            this.selectedChiller={};   
            this.chillerProductList=[];
          }
        }
        this.loadingData=false;
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
      }
    );
  }

  getChillerProductList(productId) {
    this.loadingData=true;
    const obj={
      chillerId: this.selectedChiller.id,
      productId:productId
    }
    this.httpService.getChillerProductList(obj).subscribe(
      (data:any) => {
        if (data) {
          this.chillerProductList = data;
        }
        this.loadingData=false;
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
      }
    );
  }



  getChillerPlanogramList(productId) {
    this.loadingData=true;
    const obj={
      chillerId: this.selectedChiller.id
    }
    this.httpService.getChillerPlanogramList(obj).subscribe(
      (data:any) => {
        if (data) {
          this.planogramList=data;
        }
        this.loadingData=false;
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
      }
    );
  }


hideChildModal(){
    this.form.reset();
    this.childModal.hide();
}

showInsertModal(){
  this.isUpdateRequest=false;
  this.operationType="Create";
  this.form.patchValue({
    id:-1,
    channelId: this.selectedChannel.id
  });
  this.childModal.show();
}

showUpdateModal(){
this.operationType="Update";
this.isUpdateRequest=true
this.form.patchValue({
  id: this.selectedChiller.id,
  title: this.selectedChiller.title,
  codeVerification: this.selectedChiller.codeVerification,
  channelId: this.selectedChannel.id
});
this.childModal.show();
}

insertData(data) {
  this.loadingModalButton = true;
  const formData = new FormData();
  formData.append("formData", JSON.stringify(data));
  const url=this.isUpdateRequest? "update-chiller": "insertChiller";
  this.httpService.insertChiller(formData, url).subscribe((data: any) => {
    if (data.success == "true") {
      this.toastr.success(data.message);
      if(this.selectedChannel.id){
      this.getChillerList();
      }
      this.hideChildModal();
    } else {
      this.toastr.error(data.message, "Error");
    }
    this.loadingModalButton = false;
  });
}

}
