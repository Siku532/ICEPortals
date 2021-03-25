import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatTableModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatNativeDateModule,
  MatRadioModule,
  MatCheckboxModule,
  MatMenuModule,
} from "@angular/material";
import { MatGridListModule } from "@angular/material/grid-list";
import {
  MatDatepickerModule,
  MatDatepickerToggle,
} from "@angular/material/datepicker";

import { StatModule } from "../../shared/modules/stat/stat.module";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { HttpClientModule } from "@angular/common/http";
import { HomeComponent } from "./innerComponents/home/home.component";
import { ShopListComponent } from "./innerComponents/shop-list/shop-list.component";
import { SummaryComponent } from "./innerComponents/summary/summary.component";
import { ProductivityComponent } from "./innerComponents/productivity/productivity.component";
import { FilterBarComponent } from "./innerComponents/filter-bar/filter-bar.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DetailsComponent } from "./innerComponents/details/details.component";
import { DailyVisitReportComponent } from "./innerComponents/daily-visit-report/daily-visit-report.component";
import { ShopDetailComponent } from "./innerComponents/shop-detail/shop-detail.component";
import { ModalModule } from "ngx-bootstrap/modal";
import { MslDashboardComponent } from "./innerComponents/msl-dashboard/msl-dashboard.component";
import { ProductivityDashboardComponent } from "./innerComponents/productivity-dashboard/productivity-dashboard.component";
import { ChartsModule as Ng2Charts } from "ng2-charts";
import { TposmDeploymentReportComponent } from "./innerComponents/tposm-deployment-report/tposm-deployment-report.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { LineChartComponent } from "./innerComponents/home/line-chart/line-chart.component";
import { UpdatePasswordComponent } from "./user/update-password/update-password.component";
import { RawDataComponent } from "./raw-data/raw-data.component";
import { MatTableComponent } from "./innerComponents/mat-table/mat-table.component";
import { Ng2OrderModule } from "ng2-order-pipe";
import { DataAvailabilityComponent } from "./data-availability/data-availability.component";
import { ButtonsModule } from "ngx-bootstrap";
import { MerchandiserListComponent } from "./innerComponents/merchandiser-list/merchandiser-list.component";
import { AbnormalityComponent } from "./innerComponents/abnormality/abnormality.component";
import { TimeAnalysisReportComponent } from "./innerComponents/time-analysis-report/time-analysis-report.component";
import { NgxPaginationModule } from "ngx-pagination";
import { MerchandiserAttendanceComponent } from "./innerComponents/merchandiser-attendance/merchandiser-attendance.component";
import { DailyEvaluationReportComponent } from "./innerComponents/daily-evaluation-report/daily-evaluation-report.component";
import { BsDropdownModule } from "ngx-bootstrap";
import { EmailManagerComponent } from "./innerComponents/email-manager/email-manager.component";
import { MessageStatusListComponent } from "./innerComponents/email-manager/childComponents/message-status-list/message-status-list.component";
import { AddNewMessageComponent } from "./innerComponents/email-manager/childComponents/add-new-message/add-new-message.component";
import { UploadRoutesComponent } from "./innerComponents/upload-routes/upload-routes.component";
import { SingleRouteDetailComponent } from "./innerComponents/upload-routes/routes-inner-pages/single-route-detail/single-route-detail.component";
import { ShopsForSingleRouteComponent } from "./innerComponents/upload-routes/routes-inner-pages/shops-for-single-route/shops-for-single-route.component";
import { AddEditGroupComponent } from "./innerComponents/email-manager/childComponents/add-edit-group/add-edit-group.component";
import { AddDeviceComponent } from "./innerComponents/add-device/add-device.component";
import { SupervisorWwwrSummaryComponent } from "./innerComponents/supervisor-wwwr-summary/supervisor-wwwr-summary.component";
import { ShopListReportComponent } from "./innerComponents/shop-list-report/shop-list-report.component";
import { UploadRoutesNewComponent } from "./innerComponents/upload-routes-new/upload-routes-new.component";
import { MerchandiserPlannedCallsComponent } from "./innerComponents/merchandiser-planned-calls/merchandiser-planned-calls.component";
import { TableauHelperComponent } from "./Tableau/tableau-helper/tableau-helper.component";
import { DashboardTableauComponent } from "./Tableau/dashboard-tableau/dashboard-tableau.component";
import { ProductivityTableauComponent } from "./Tableau/productivity-tableau/productivity-tableau.component";
import { SkuDashboardComponent } from "./Tableau/sku-dashboard/sku-dashboard.component";
import { VoErrorReportComponent } from "./innerComponents/vo-error-report/vo-error-report.component";
import { MerchandiserScoreComponent } from "./innerComponents/merchandiser-score/merchandiser-score.component";
import { MerchandiserWiseScoreComponent } from "./innerComponents/merchandiser-wise-score/merchandiser-wise-score.component";
import { ComplienceReportComponent } from "./innerComponents/complience-report/complience-report.component";
import { UniqueBasedProductivityReportComponent } from "./innerComponents/unique-based-productivity-report/unique-based-productivity-report.component";
import { BrandSkuReportNewComponent } from "./innerComponents/brand-sku-report-new/brand-sku-report-new.component";
import { MtDashboardComponent } from "./Tableau/mt-dashboard/mt-dashboard.component";
import { GtDashboardComponent } from "./Tableau/gt-dashboard/gt-dashboard.component";
import { SssGtDashboardComponent } from "./Tableau/sss-gt-dashboard/sss-gt-dashboard.component";
import { ComplianceDashboardComponent } from "./Tableau/compliance-dashboard/compliance-dashboard.component";
import { TrendingOosReportComponent } from "./innerComponents/trending-oos-report/trending-oos-report.component";
import { MtdOosReportComponent } from './mtd-oos-report/mtd-oos-report.component';
import { ManageProductsComponent } from './innerComponents/manage-products/manage-products.component';
import { AccordionModule } from "ngx-bootstrap";
import { MatExpansionModule } from "@angular/material/expansion";
import { ExpiryDataReportComponent } from './innerComponents/expiry-data-report/expiry-data-report.component';
import { ManageSurveyorsComponent } from './innerComponents/manage-surveyors/manage-surveyors.component';
import { ComplianceDashboardNationalComponent } from './Tableau/compliance-dashboard-national/compliance-dashboard-national.component';
import { ProfileComponent } from './innerComponents/profile/profile.component';
import { UploadHurdleRateComponent } from './innerComponents/upload-hurdle-rate/upload-hurdle-rate.component';
import { VdComplianceMtComponent } from './Tableau/vd-compliance-mt/vd-compliance-mt.component';
import { VdComplianceGtComponent } from './Tableau/vd-compliance-gt/vd-compliance-gt.component';
import { AttendanceReportComponent } from './innerComponents/attendance-report/attendance-report.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    DashboardRoutingModule,
    MatGridListModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    StatModule,
    MatCardModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false }),
    ModalModule.forRoot(),
    Ng2Charts,
    Ng2OrderModule,
    ButtonsModule.forRoot(),
    NgxPaginationModule,
    MatRadioModule,
    MatCheckboxModule,
    BsDropdownModule.forRoot(),
    MatMenuModule,
    ReactiveFormsModule,
    AccordionModule,
    MatExpansionModule,
    NgxMatSelectSearchModule
  ],
  declarations: [
    DashboardComponent,
    HomeComponent,
    ShopListComponent,
    SummaryComponent,
    ProductivityComponent,
    FilterBarComponent,
    DetailsComponent,
    DailyVisitReportComponent,
    ShopDetailComponent,
    MslDashboardComponent,
    ProductivityDashboardComponent,
    TposmDeploymentReportComponent,
    LineChartComponent,
    UpdatePasswordComponent,
    RawDataComponent,
    MatTableComponent,
    DataAvailabilityComponent,
    MerchandiserListComponent,
    AbnormalityComponent,
    TimeAnalysisReportComponent,
    MerchandiserAttendanceComponent,
    DailyEvaluationReportComponent,
    EmailManagerComponent,
    MessageStatusListComponent,
    AddNewMessageComponent,
    UploadRoutesComponent,
    SingleRouteDetailComponent,
    ShopsForSingleRouteComponent,
    AddEditGroupComponent,
    AddDeviceComponent,
    SupervisorWwwrSummaryComponent,
    ShopListReportComponent,
    UploadRoutesNewComponent,
    MerchandiserPlannedCallsComponent,
    TableauHelperComponent,
    DashboardTableauComponent,
    ProductivityTableauComponent,
    SkuDashboardComponent,
    VoErrorReportComponent,
    MerchandiserScoreComponent,
    MerchandiserWiseScoreComponent,
    ComplienceReportComponent,
    UniqueBasedProductivityReportComponent,
    BrandSkuReportNewComponent,
    MtDashboardComponent,
    GtDashboardComponent,
    SssGtDashboardComponent,
    ComplianceDashboardComponent,
    TrendingOosReportComponent,
    MtdOosReportComponent,
    ManageProductsComponent,
    ExpiryDataReportComponent,
    ManageSurveyorsComponent,
    ComplianceDashboardNationalComponent,
    ProfileComponent,
    UploadHurdleRateComponent,
    VdComplianceMtComponent,
    VdComplianceGtComponent,
    AttendanceReportComponent
  ],
})
export class DashboardModule {}
