import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { AuthGuard } from "src/app/shared/guard";
import { DashboardGuard } from "./dashboard.guard";
import { HomeComponent } from "./innerComponents/home/home.component";
import { ShopListComponent } from "./innerComponents/shop-list/shop-list.component";
import { SummaryComponent } from "./innerComponents/summary/summary.component";
import { ProductivityComponent } from "./innerComponents/productivity/productivity.component";
import { DetailsComponent } from "./innerComponents/details/details.component";
import { DailyVisitReportComponent } from "./innerComponents/daily-visit-report/daily-visit-report.component";
import { pathToFileURL } from "url";
import { ShopDetailComponent } from "./innerComponents/shop-detail/shop-detail.component";
import { MslDashboardComponent } from "./innerComponents/msl-dashboard/msl-dashboard.component";
import { ProductivityDashboardComponent } from "./innerComponents/productivity-dashboard/productivity-dashboard.component";
import { TposmDeploymentReportComponent } from "./innerComponents/tposm-deployment-report/tposm-deployment-report.component";
import { UpdatePasswordComponent } from "./user/update-password/update-password.component";
import { RawDataComponent } from "./raw-data/raw-data.component";
import { DataAvailabilityComponent } from "./innerComponents/data-availability/data-availability.component";
import { MerchandiserListComponent } from "./innerComponents/merchandiser-list/merchandiser-list.component";
import { AbnormalityComponent } from "./innerComponents/abnormality/abnormality.component";
import { TimeAnalysisReportComponent } from "./innerComponents/time-analysis-report/time-analysis-report.component";
import { MerchandiserAttendanceComponent } from "./innerComponents/merchandiser-attendance/merchandiser-attendance.component";
import { DailyEvaluationReportComponent } from "./innerComponents/daily-evaluation-report/daily-evaluation-report.component";
import { EmailManagerComponent } from "./innerComponents/email-manager/email-manager.component";
import { UploadRoutesComponent } from "./innerComponents/upload-routes/upload-routes.component";
import { SingleRouteDetailComponent } from "./innerComponents/upload-routes/routes-inner-pages/single-route-detail/single-route-detail.component";
import { ShopsForSingleRouteComponent } from "./innerComponents/upload-routes/routes-inner-pages/shops-for-single-route/shops-for-single-route.component";
import { AddDeviceComponent } from "./innerComponents/add-device/add-device.component";
import { SupervisorWwwrSummaryComponent } from "./innerComponents/supervisor-wwwr-summary/supervisor-wwwr-summary.component";
import { ShopListReportComponent } from "./innerComponents/shop-list-report/shop-list-report.component";
import { UploadRoutesNewComponent } from "./innerComponents/upload-routes-new/upload-routes-new.component";
import { MerchandiserPlannedCallsComponent } from "./innerComponents/merchandiser-planned-calls/merchandiser-planned-calls.component";
import { DashboardTableauComponent } from "./Tableau/dashboard-tableau/dashboard-tableau.component";
import { ProductivityTableauComponent } from "./Tableau/productivity-tableau/productivity-tableau.component";
import { SkuDashboardComponent } from "./Tableau/sku-dashboard/sku-dashboard.component";
import { MerchandiserScoreComponent } from "./innerComponents/merchandiser-score/merchandiser-score.component";
import { VoErrorReportComponent } from "./innerComponents/vo-error-report/vo-error-report.component";
import { MerchandiserWiseScoreComponent } from "./innerComponents/merchandiser-wise-score/merchandiser-wise-score.component";
import { ComplienceReportComponent } from "./innerComponents/complience-report/complience-report.component";
import { TableauHelperComponent } from "./Tableau/tableau-helper/tableau-helper.component";
import { UniqueBasedProductivityReportComponent } from "./innerComponents/unique-based-productivity-report/unique-based-productivity-report.component";
import { BrandSkuReportNewComponent } from "./innerComponents/brand-sku-report-new/brand-sku-report-new.component";
import { MtDashboardComponent } from "./Tableau/mt-dashboard/mt-dashboard.component";
import { GtDashboardComponent } from "./Tableau/gt-dashboard/gt-dashboard.component";
import { SssGtDashboardComponent } from "./Tableau/sss-gt-dashboard/sss-gt-dashboard.component";
import { ComplianceDashboardComponent } from "./Tableau/compliance-dashboard/compliance-dashboard.component";
import { TrendingOosReportComponent } from "./innerComponents/trending-oos-report/trending-oos-report.component";
import { MtdOosReportComponent } from './innerComponents/mtd-oos-report/mtd-oos-report.component';
import { ManageProductsComponent } from './innerComponents/manage-products/manage-products.component';
import { ExpiryDataReportComponent } from './innerComponents/expiry-data-report/expiry-data-report.component';
import { ManageSurveyorsComponent } from './innerComponents/manage-surveyors/manage-surveyors.component';
import { ComplianceDashboardNationalComponent } from './Tableau/compliance-dashboard-national/compliance-dashboard-national.component';
import { ProfileComponent } from './innerComponents/profile/profile.component';
import { UploadHurdleRateComponent } from './innerComponents/upload-hurdle-rate/upload-hurdle-rate.component';
import { VdComplianceMtComponent } from './Tableau/vd-compliance-mt/vd-compliance-mt.component';
import { VdComplianceGtComponent } from './Tableau/vd-compliance-gt/vd-compliance-gt.component';
import { AttendanceReportComponent } from './innerComponents/attendance-report/attendance-report.component';
import { VdReportComponent } from './innerComponents/vd-report/vd-report.component';
import { MerchandiserRosterComponent } from './innerComponents/merchandiser-roster/merchandiser-roster.component';
import { UploadDesiredSosComponent } from './innerComponents/upload-desired-sos/upload-desired-sos.component';
import { ShopWiseRoutesComponent } from './innerComponents/shop-wise-routes/shop-wise-routes.component';

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    canActivate: [DashboardGuard],
    children: [
      { path: "", redirectTo: "home", pathMatch: "full" },
      { path: "home", component: HomeComponent },
      { path: "main", component: ProfileComponent },
      { path: "daily_visit_report", component: DailyVisitReportComponent },
      { path: "oos_details_report", component: DetailsComponent },
      { path: "shop_list_report", component: ShopListComponent },
      { path: "summary_report", component: SummaryComponent },
      { path: "productivity_report", component: ProductivityComponent },
      { path: "msl_dashboard", component: MslDashboardComponent },
      { path: "manage_products", component: ManageProductsComponent },
      { path: "manage_surveyors", component: ManageSurveyorsComponent },
      {
        path: "trending_oos_report",
        component: TrendingOosReportComponent,
      },
      {
        path: "productivity_dashboard",
        component: ProductivityDashboardComponent,
      },
      {
        path: "tposm_deployment_report",
        component: TposmDeploymentReportComponent,
      },
      {
        path: "daily_evaluation_report",
        component: DailyEvaluationReportComponent,
      },
      { path: "update_password", component: UpdatePasswordComponent },
      { path: "raw_data", component: RawDataComponent },
      { path: "brand_sku_oos", component: DataAvailabilityComponent },
      { path: "brand_sku_oos_gt", component: DataAvailabilityComponent },
      {
        path: "brand_sku_oos_gt/:regionId",
        component: DataAvailabilityComponent,
      },
      {
        path: "brand_sku_oos_so",
        component: DataAvailabilityComponent,
      },
      {
        path: "brand_sku_oos_so/:regionId",
        component: DataAvailabilityComponent,
      },
      { path: "brand_sku_oos_imt", component: DataAvailabilityComponent },
      {
        path: "brand_sku_oos_imt/:clusterId",
        component: DataAvailabilityComponent,
      },
      {
        path: "supervisor_wwwr_summary",
        component: SupervisorWwwrSummaryComponent,
      },
      { path: "data_abnormality_report", component: AbnormalityComponent },
      { path: "time-analysis-report", component: TimeAnalysisReportComponent },
      { path: "shop-list-report", component: ShopListReportComponent },
      { path: "merchandiser_List", component: MerchandiserListComponent },
      {
        path: "merchandiser_attendance",
        component: MerchandiserAttendanceComponent,
      },
      { path: "sms_manager", component: EmailManagerComponent },
      { path: "upload_routes/route_list", component: UploadRoutesComponent },
      {
        path: "upload_routes/single_route_details",
        component: SingleRouteDetailComponent,
      },
      {
        path: "upload_routes/shops_for_single_route",
        component: ShopsForSingleRouteComponent,
      },
      { path: "add_device", component: AddDeviceComponent },
      { path: "upload_routes_new", component: UploadRoutesNewComponent },
      { path: "upload_routes/:surveyorId", component: ShopWiseRoutesComponent },
      {
        path: "merchandiser-planned-calls",
        component: MerchandiserPlannedCallsComponent,
      },
      { path: "availability-tableau", component: DashboardTableauComponent },
      { path: "rental-dashboard", component: ProductivityTableauComponent },
      { path: "availability-dashboard", component: SkuDashboardComponent },
      { path: "mt-dashboard", component: MtDashboardComponent },
      { path: "gt-dashboard", component: GtDashboardComponent },
      { path: "sss-gt-dashboard", component: SssGtDashboardComponent },
      { path: "compliance-dashboard", component: ComplianceDashboardComponent },
      { path: "merchandiser_score", component: MerchandiserScoreComponent },
      { path: "vo_error_report", component: VoErrorReportComponent },
      { path: "raw_data/:reportId", component: RawDataComponent },
      {
        path: "merchandiser_wise_score",
        component: MerchandiserWiseScoreComponent,
      },
      {
        path: "merchandiser_score/:surveyorId/:startDate/:endDate",
        component: MerchandiserScoreComponent,
      },
      {
        path: "mtd-oos-mt",
        component: MtdOosReportComponent,
      },
      {
        path: "mtd-oos-gt",
        component: MtdOosReportComponent,
      },

      { path: "compliance-report", component: ComplienceReportComponent },
      {
        path: "capturedAbnormalUnvisited",
        component: UniqueBasedProductivityReportComponent,
      },
      { path: "expiry-data-mt", component: ExpiryDataReportComponent },
      { path: "expiry-data-gt", component: ExpiryDataReportComponent },
      { path: "compliance-dashboard-national", component: ComplianceDashboardNationalComponent },
      { path: "vd-compliance-mt", component: VdComplianceMtComponent },
      { path: "vd-compliance-gt", component: VdComplianceGtComponent },
      { path: "attendance-report", component: AttendanceReportComponent },
      { path: "upload_hurdle_rates", component: UploadHurdleRateComponent },
      { path: "vd-report-mt", component: VdReportComponent },
      { path: "vd-report-gt", component: VdReportComponent },
      { path: "merchandiser_roster", component: MerchandiserRosterComponent },
      { path: "upload_desired_sos", component: UploadDesiredSosComponent },
      {
        path: "tableau",
        component: TableauHelperComponent,
      },
    ],
  },
  // { path: 'shop_detail/:id', component: ShopDetailComponent },
  { path: "shop_detail/:id", component: ShopDetailComponent },

  {
    path: "evaluation",
    loadChildren: "./evaluation/evaluation.module#EvaluationModule",
  },
  {
    path: "instogram",
    loadChildren: "./market-intelligence/market-intelligence.module#MarketIntelligenceModule",
  },
  {path: 'virtual_view', loadChildren: './virtual-view/virtual-view.module#VirtualViewModule'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
