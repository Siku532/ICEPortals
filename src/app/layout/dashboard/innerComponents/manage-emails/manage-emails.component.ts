import { Component, OnInit, ViewChild } from "@angular/core";
import { DashboardService } from "../../dashboard.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";

@Component({
  selector: "app-manage-emails",
  templateUrl: "./manage-emails.component.html",
  styleUrls: ["./manage-emails.component.scss"],
})
export class ManageEmailsComponent implements OnInit {
  loadingData: boolean;
  loadingModal: boolean;
  loadingModalButton: boolean;
  projectType: any;
  emailList: any = [];
  tmpEmailList: any = [];
  emailTypes: any = [];
  selectedEmailType: any;
  addressTypes: any = [];
  clusterList: any = [];
  zones: any = [];
  regions: any = [];
  selectedCluster: any = {};
  selectedZone: any = {};
  selectedRegion: any = {};
  activeStatus: any = [
    { id: 1, value: "Y" },
    { id: 2, value: "N" },
  ];

  zonePlaceholder: any;
  regionPlaceholder: any;
  clusterPlaceHolder: any;

  isUpdateRequest: boolean;
  modalTitle: any;

  @ViewChild("childModal") childModal: ModalDirective;

  form: FormGroup;

  constructor(
    private httpService: DashboardService,
    private router: Router,
    private toastr: ToastrService,
    public formBuilder: FormBuilder
  ) {
    this.projectType = localStorage.getItem("projectType");
    this.clusterPlaceHolder = "Cluster";
    if (this.projectType == "NFL") {
      this.zonePlaceholder = "Region";
      this.regionPlaceholder = "Zone";
      this.form = formBuilder.group({
        id: new FormControl(""),
        email: new FormControl("", [Validators.required]),
        addressType: new FormControl("", [Validators.required]),
        emailType: new FormControl("", [Validators.required]),
        emailTypeTitle: new FormControl(""),
        cluster: this.formBuilder.group({
          id: new FormControl("", [Validators.required]),
          title: new FormControl(""),
        }),
        zone: this.formBuilder.group({
          id: new FormControl("", [Validators.required]),
          title: new FormControl(""),
        }),
        region: this.formBuilder.group({
          id: new FormControl("", [Validators.required]),
          title: new FormControl(""),
        }),
        active: new FormControl("", [Validators.required]),
      });
    } else {
      this.form = formBuilder.group({
        id: new FormControl(""),
        email: new FormControl("", [Validators.required]),
        addressType: new FormControl("", [Validators.required]),
        emailType: new FormControl(""),
        emailTypeTitle: new FormControl("", [Validators.required]),
        zone: this.formBuilder.group({
          id: new FormControl("", [Validators.required]),
        }),
        region: this.formBuilder.group({
          id: new FormControl("", [Validators.required]),
        }),
        active: new FormControl("", [Validators.required]),
      });
      this.zonePlaceholder = "Zone";
      this.regionPlaceholder = "Region";
    }
  }

  ngOnInit() {
    this.getAllEmails();
  }

  getAllEmails() {
    this.loadingData = true;
    const obj = {
      act: 23,
      emailType: null,
    };
    this.httpService.getFilterData(obj).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.emailList = data;
          this.getEmailTypes();
        }
        if (!res) {
          this.toastr.info("No data Found", "Info");
        }
        this.loadingData = false;
      },
      (error) => {
        this.loadingData = false;
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
      }
    );
  }
  getEmailByType() {
    this.tmpEmailList = [];
    if (this.selectedEmailType.emailType == "All") {
      this.tmpEmailList = this.emailList;
    } else {
      for (const element of this.emailList) {
        if (element.emailType == this.selectedEmailType.emailType) {
          this.tmpEmailList.push(element);
        }
      }
    }
  }

  getEmailTypes() {
    const obj = {
      emailType: "All",
      emailTypeTitle: "All",
    };
    this.emailTypes.push(obj);
    const emailSet = Array.from(
      new Set(this.emailList.map((item: any) => item.emailType))
    ).map((emailType) => {
      return {
        emailType: emailType,
        emailTypeTitle: this.emailList.find((e) => e.emailType == emailType)
          .emailTypeTitle,
      };
    });
    for (const element of emailSet) {
      this.emailTypes.push(element);
    }
  }

  getZoneByCluster(cluster) {
    this.loadingModal = true;
    this.selectedZone = {};
    this.selectedRegion = {};
    this.selectedCluster = cluster;
    this.httpService.getZoneByCluster(this.selectedCluster.id || -1).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.zones = res;
        }
        this.loadingModal = false;
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
        this.loadingModal = false;
      }
    );
  }

  getSelectiveClusters() {
    this.loadingData = true;
    this.httpService.getAllClusters().subscribe(
      (data) => {
        const res: any = data;
        if (res.clusterList) {
          this.clusterList = res.clusterList;
        }
        this.loadingData = false;
      },
      (error) => {
        error.status === 0
          ? this.toastr.error("Please check Internet Connection", "Error")
          : this.toastr.error(error.description, "Error");
        this.loadingData = false;
      }
    );
  }

  zoneChange(zone) {
    this.loadingModal = true;
    this.selectedRegion = {};
    this.selectedZone = zone;
    this.httpService.getRegion(this.selectedZone.id).subscribe(
      (data) => {
        const res: any = data;
        if (res) {
          this.regions = res;
        } else {
          this.loadingModal = false;
          this.toastr.info(
            "Something went wrong,Please retry",
            "Connectivity Message"
          );
        }

        setTimeout(() => {
          this.loadingModal = false;
        }, 500);
      },
      (error) => {
        this.loadingModal = false;
      }
    );
  }

  regionChange(region) {
    this.selectedRegion = region;
  }

  showInsertModal() {
    this.isUpdateRequest = false;
    this.modalTitle = "Add New Email";
    if (this.emailList.length == 0) {
      this.getAllEmails();
    }
    this.form.patchValue({
      id: -1,
    });
    if (this.projectType == "NFL") {
      this.getSelectiveClusters();
    } else {
      this.zones = localStorage.getItem("zoneList");
    }
    this.addressTypes = Array.from(
      new Set(this.emailList.map((item: any) => item.addressType))
    );
    this.childModal.show();
  }

  showUpdateModal(data) {
    this.isUpdateRequest = true;
    this.modalTitle = "Update Email";
    this.addressTypes = Array.from(
      new Set(this.emailList.map((item: any) => item.addressType))
    );
    if (this.projectType == "NFL") {
      this.getSelectiveClusters();
      this.getZoneByCluster(data.cluster);
      this.zoneChange(data.zone);
      this.form.patchValue({
        id: data.id,
        email: data.email,
        emailType: data.emailType,
        emailTypeTitle: data.emailTypeTitle,
        addressType: data.addressType,
        cluster: {
          id: data.cluster.id,
          title: this.selectedCluster.title,
        },
        zone: {
          id: data.zone.id,
          title: this.selectedZone.title,
        },
        region: {
          id: data.region.id,
          title: this.selectedRegion.title,
        },
        active: data.active,
      });
    } else {
      this.zones = localStorage.getItem("zoneList");
      this.form.patchValue({
        id: data.id,
        email: data.email,
        emailType: data.emailType,
        emailTypeTitle: data.emailTypeTitle,
        addressType: data.addressType,
        zone: {
          id: data.zone.id,
          title: this.selectedZone.title,
        },
        region: {
          id: data.region.id,
          title: this.selectedRegion.title,
        },
        active: data.active,
      });
      this.zoneChange(data.zone);
    }
    this.childModal.show();
  }

  hideModal() {
    this.clusterList = [];
    this.zones = [];
    this.regions = [];
    this.form.reset();
    this.childModal.hide();
  }

  insertUpdateData(form) {
    this.loadingModal = true;
    this.loadingModalButton = true;
    const formData = new FormData();
    formData.append("data", JSON.stringify(form));
    const url = this.isUpdateRequest ? "updateEmail" : "addNewEmail"; // UpdateEmailController || AddEmailController

    this.httpService.addUpdateEmail(formData, url).subscribe((data: any) => {
      if (data.success == "true") {
        this.toastr.success(data.message);
        if (this.isUpdateRequest) {
          this.spliceEmail(form, -1);
        } else {
          this.addNewEmail(form, data.id);
        }
      } else {
        this.toastr.error(data.message, "Error");
      }
      this.loadingModal = false;
      this.loadingModalButton = false;
    });
  }

  getEmailTypeTitle() {
    this.loadingModal = true;
    const emailType = this.form.get("emailType").value;
    const i = this.emailTypes.findIndex((e) => e.emailType === emailType);
    this.form.controls["emailTypeTitle"].setValue(
      this.emailTypes[i].emailTypeTitle
    );
    this.loadingModal = false;
  }
  addNewEmail(data, id) {
    const obj = this.fillObj(data, id);
    this.emailList.push(obj);
    if (this.tmpEmailList.length > 0) {
      this.getEmailByType();
    }
  }

  spliceEmail(data, id) {
    const j = this.emailList.findIndex((e) => e.id == data.id);
    const i = this.tmpEmailList.findIndex((e) => e.id == data.id);
    const obj = this.fillObj(data, id);
    this.tmpEmailList.splice(i, 1, obj);
    this.emailList.splice(j, 1, obj);
  }

  fillObj(data, id) {
    let obj;
    if (this.projectType == "NFL") {
      obj = {
        id: id > -1 ? id : data.id,
        email: data.email,
        emailType: data.emailType,
        emailTypeTitle: data.emailTypeTitle,
        addressType: data.addressType,
        cluster: {
          id: data.cluster.id,
          title: this.selectedCluster.title,
        },
        zone: {
          id: data.zone.id,
          title: this.selectedZone.title,
        },
        region: {
          id: data.region.id,
          title: this.selectedRegion.title,
        },
        active: data.active,
      };
    } else {
      obj = {
        id: id > -1 ? id : data.id,
        email: data.email,
        emailType: data.emailType,
        emailTypeTitle: data.emailTypeTitle,
        addressType: data.addressType,
        zone: {
          id: data.zone.id,
          title: this.selectedZone.title,
        },
        region: {
          id: data.region.id,
          title: this.selectedRegion.title,
        },
        active: data.active,
      };
    }
    return obj;
  }
}
