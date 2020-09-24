import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DashboardService } from '../../dashboard.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss']
})
export class AddDeviceComponent implements OnInit {

  title = 'add Device';
  @ViewChild('childModal') childModal: ModalDirective;
  form: FormGroup;
  response: any;
  success: boolean;
  imeis: any = [];
  selectedItem: any = {};
  selectedImeiNumber: any = '';
  imeiStatus: any;
  loadingData: boolean;

  statusArray: any = [{ title: 'Activate', value: 'Y' }, { title: 'De-activate', value: 'N' }];

  number = new FormControl('', [Validators.required]);
  constructor(public fb: FormBuilder, private httpService: DashboardService,
    private toaster: ToastrService) {
    this.form = fb.group({
      number: this.number,
      avatar: null
    });
  }

  ngOnInit() {
    this.loadingData = false;
    this.getImeis();
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get('avatar').setValue(file);
    }
  }

  onSubmit(post) {
    const formData = new FormData();

    // tslint:disable-next-line:prefer-const
    let model: any;
    //  model.Number = post.number;



    // formData.append('model', JSON.stringify(model));

    formData.append('imei', post.number);
    formData.append('filePath', this.form.get('avatar').value);

    this.httpService.uploadImei(formData).subscribe(data => {
      console.log(data);
      this.response = data;
    });
    if (this.response === 'Imeis Added into System.') {

    }
  }

  getImeis() {
    this.httpService.getImeis().subscribe((data: any) => {
      this.imeis = data.imeiList;
    });
  }

  showChildModal(item?): void {
    this.selectedItem = item;
    this.selectedImeiNumber = this.selectedItem.imei;
    this.childModal.show();
  }

  hideChildModal(): void {
    this.childModal.hide();
  }

  updateImei() {
    const obj = {
      imei: this.selectedImeiNumber,
      imeiStatus: this.imeiStatus
    };

    this.httpService.updateImeiStatus(obj).subscribe((data: any) => {
      if (data.status) {
        this.toaster.success(data.message);
        /* this.updateArray(data.surveyorId,data.deName)*/
        this.getImeis();
      } else {
        this.toaster.warning(data.message);
      }
      this.hideChildModal();

    }, error => {
      if (error.statusText) {
        this.toaster.error(error.statusText);
      } else {
        this.toaster.error(error.message);
      }
      this.hideChildModal();

    });
  }

}
