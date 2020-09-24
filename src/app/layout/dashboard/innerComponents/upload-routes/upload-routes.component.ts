import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-upload-routes',
  templateUrl: './upload-routes.component.html',
  styleUrls: ['./upload-routes.component.scss']
})
export class UploadRoutesComponent implements OnInit {

  title = 'upload Routes';
  regions: any = [];
  selectedRegion: any = {};
  minDate = new Date();
  maxDate = new Date(2025, 1, 1);
  startDate;
  loadingData: boolean;
  form: FormGroup;
  constructor() { }

  ngOnInit() {
    this.loadingData = false;
  }
  regionChange() {

  }
  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get('avatar').setValue(file);
    }
  }
}
