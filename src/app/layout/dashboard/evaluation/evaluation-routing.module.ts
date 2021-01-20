import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { DetailsPageComponent } from "./details-page/details-page.component";
import { MainPageComponent } from "./main-page/main-page.component";
import { ImageGalleryComponent } from "./image-gallery/image-gallery.component";

const routes: Routes = [
  { path: "", redirectTo: "list", pathMatch: "full" },
  {
    path: "list",
    component: MainPageComponent,
    children: [
      { path: "", redirectTo: "home", pathMatch: "full" },
      { path: "home", component: DetailsPageComponent },
      { path: "details/:id/:notEditable", component: HomeComponent },
      { path: "details/:id", component: HomeComponent },
      { path: "planogram-images", component: ImageGalleryComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvaluationRoutingModule {}
