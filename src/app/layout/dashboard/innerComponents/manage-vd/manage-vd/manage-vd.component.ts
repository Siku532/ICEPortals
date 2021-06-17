import {
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { DashboardService } from "../../../dashboard.service";
import { Router } from "@angular/router";
import { config } from 'src/assets/config';
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
  codeVerification:any=['Y', 'N'];

  loadingData:boolean;
  loading: boolean;
  loadingModalButton: boolean;

  isUpdateRequest:boolean;
  operationType='';
  ip=config.ip;

 planogramList:any=[];
 public image: any = File;

  @ViewChild("childModal") childModal: ModalDirective;
  @ViewChild("uploadModal") uploadModal: ModalDirective;

  form: FormGroup;
  uploadForm: FormGroup;

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
    this.uploadForm = formBuilder.group({
      title: new FormControl("", [Validators.required]),
      type:'Chiller_Verification',
      path: new FormControl("", [Validators.required]),
      chillerId: new FormControl("", [Validators.required]) 
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
  channelId: this.selectedChannel.id,
});
this.childModal.show();
}

showUploadModal(){
  this.uploadForm.patchValue({
    chillerId: this.selectedChiller.id,
    type:'Chiller_Verification',
  });
this.uploadModal.show();
}
hideUploadModal(){
  this.uploadForm.reset();
  this.uploadModal.hide();
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
onSelectFile(event) {
  if (event.target.files && event.target.files[0]) {
    this.image = <File>event.target.files[0];
    const file = event.target.files[0];
    this.image = file;
    const reader = new FileReader();
    reader.readAsDataURL(this.image);
    reader.onload = (_event) => {};
  }
}
uploadPlanogram(post){
  this.loadingModalButton=true;
  const formData = new FormData();
  formData.append("planogramData", JSON.stringify(post));
  formData.append("path", this.image);
  this.httpService.insertChillerPlanogram(formData).subscribe((data: any) => {
    if (data.success == "true") {
      this.toastr.success(data.message);
      if(this.planogramList.length>0){
        const obj={
          id: data.id,
          title:post.title,
          type:post.type,
          path: data.path,
          chillerId: post.chillerId,
          active: 'Y'
        }
        this.planogramList.push(obj);
      }
      this.hideUploadModal();
    } else {
      this.toastr.error(data.message, "Error");
    }
    this.loadingModalButton = false;
  });
}


}
