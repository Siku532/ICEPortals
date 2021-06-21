import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DashboardService } from "../../dashboard.service";
import { NgModel } from "@angular/forms";
import { ModalDirective } from "ngx-bootstrap";
import { config } from "src/assets/config";
import { ExcelService } from '../../excel.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
@Component({
  selector: 'app-upload-vd-hurdle-rates',
  templateUrl: './upload-vd-hurdle-rates.component.html',
  styleUrls: ['./upload-vd-hurdle-rates.component.scss']
})
export class UploadVdHurdleRatesComponent implements OnInit {
  @ViewChild("errorModal") errorModal: ModalDirective;
  loadingData: boolean;
  loadingUpload:boolean;
  selectedFile = new FormControl(null, [Validators.required]);
  selectedOption = new FormControl("", [Validators.required]);
  form: FormGroup;

  response:any;
  hurdleRateList:any=[];
  hurdleRateListTmp:any=[];

  chillerList:any=[];
  selectedChiller:any={};

downloadList = [{ key: 'xlsx', title: 'Excel', icon: 'fa fa-file-excel-o' }];
 selectedFileType: {};

  constructor(
    private toastr: ToastrService,
    private httpService: DashboardService,
    public formBuilder: FormBuilder,
    private excelService: ExcelService
  ) {
    this.form = formBuilder.group({
      avatar: null,
    });
  }
  ngOnInit() {
    this.getChillerList();
  }

  clearLoading() {
    this.loadingData = false;
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get("avatar").setValue(file);
    }
  }

  uploadData(post) {
    const formData = new FormData();
    formData.append("filePath", this.form.get("avatar").value);

    if (
      this.form.get("avatar").value !== null
    ) {
      this.loadingUpload = true;
      this.httpService.uploadVDHurdleRate(formData).subscribe((data) => {
        if (data) {
          this.response = data;
          if (this.response.length > 0) {
            this.showErrorModal();
            this.loadingUpload = false;
            this.toastr.info(this.response, "Info");
          }
        } else {
          this.loadingUpload = false;
          this.toastr.error("There is an error in ur file!!");
        }
        if(this.selectedChiller.id){
        this.loadHurdleRate();
        }
      });
    } else {
      this.loadingUpload = false;
      this.toastr.error("Please select a file");
    }
  }

  showErrorModal(): void {
    this.errorModal.show();
  }
  hideErrorModal(): void {
    this.errorModal.hide();
  }

  loadHurdleRate() {
    this.loadingData = true;
      const obj = {
        chillerId: this.selectedChiller.id || -1
      }
      this.httpService.getVDHurdleRate(obj).subscribe(
        (data) => {
          if (data) {
            this.hurdleRateList = data;
            if(this.hurdleRateList.length==0){
              this.toastr.info("No Data Found");
            }
          }
          this.loadingData=false;
        },
        (error) => {
          error.status === 0
            ? this.toastr.error("Please check Internet Connection", "Error")
            : this.toastr.error(error.description, "Error");
            this.loadingData=false;
        }
      );
    }

          downloadFile(file, dataTable) {
             this.loadingData=true;
            const type = file.key;
            const data: any = dataTable;
            const fileTitle = 'VD Hurdle Rate Sample';
        
        
            if (type === 'csv') {
            new ngxCsv(data, fileTitle);
            } else if (type === 'xlsx') {
            this.excelService.exportAsExcelFile(data, fileTitle);
                 }
        
            this.selectedFileType = {};
            setTimeout(() => {
              this.loadingData = false;
            }, 1000);
          }


          downloadHurdleRate(){
            this.loadingData = true;
            const obj = {
             chillerId: this.selectedChiller.id
            }
            this.httpService.getVDHurdleRate(obj).subscribe(
              (data) => {
                if (data) {
                  this.hurdleRateListTmp = data;
                  if(this.hurdleRateListTmp.length==0){
                    this.toastr.info("No Data Found");
                  }
                  else{
                    this.downloadFile(this.downloadList[0],this.hurdleRateListTmp)
                  }
                }
                this.loadingData=false;
              },
              (error) => {
                error.status === 0
                  ? this.toastr.error("Please check Internet Connection", "Error")
                  : this.toastr.error(error.description, "Error");
                  this.loadingData=false;
              }
            );
          }


          getChillerList() {
            this.loadingData=true;
            this.httpService.getChillerList(11).subscribe(
              (data) => {
                if (data) {
                  this.chillerList = data;
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
        
  }

