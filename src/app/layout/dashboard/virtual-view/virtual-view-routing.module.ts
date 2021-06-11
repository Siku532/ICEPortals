import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { VoTrackingComponent } from './vo-tracking/vo-tracking.component';

const routes: Routes = [
  { path: '',redirectTo:'list' ,pathMatch:'full' },
  { path: 'list', component:MainComponent,
children:[
  { path: '', redirectTo:'tracking',pathMatch:'full'},
  { path: 'tracking',component:VoTrackingComponent },
] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VirtualViewRoutingModule { }
