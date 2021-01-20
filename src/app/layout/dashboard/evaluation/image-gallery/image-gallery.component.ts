import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { config } from "src/assets/config";

@Component({
  selector: "app-image-gallery",
  templateUrl: "./image-gallery.component.html",
  styleUrls: ["./image-gallery.component.scss"],
})
export class ImageGalleryComponent implements OnInit {
  imageList: any = [];
  isSeleted: boolean = false;
  selectedImage: any = {};
  configFile = config;
  ip: any = this.configFile.ip;

  constructor(
    private activatedRoute: ActivatedRoute,
    private readonly location: Location
  ) {
    this.activatedRoute.queryParams.subscribe((param) => {
      if (param != null && param != undefined) {
        this.imageList = JSON.parse(param.imageList);
      }
    });
    this.selectedImage = this.imageList[0];
    this.location.replaceState("/planogram-images");
  }

  ngOnInit(): void {}

  setSelectedImage(img) {
    this.selectedImage = img;
  }

  isImageSelected(img) {
    return img == this.selectedImage;
  }

  changeImage(imgIndex) {
    let index =
      this.imageList.findIndex((element) => element == this.selectedImage) +
      imgIndex;
    if (index < 0) {
      index = 0;
    }
    if (index == this.imageList.length) {
      index = 0;
    }
    this.selectedImage = this.imageList[index];
  }
}
