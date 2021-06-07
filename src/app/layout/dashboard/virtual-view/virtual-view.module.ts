import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';
import { ModalModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import { AccordionModule } from 'ngx-bootstrap';
import { MatCardModule, MatFormFieldModule } from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSliderModule} from '@angular/material/slider';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import {NgxPaginationModule} from 'ngx-pagination';
import { ResizableModule } from 'angular-resizable-element';
import { Ng5SliderModule } from 'ng5-slider';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule, MatIconModule, MatTableModule, MatSelectModule, MatNativeDateModule,
   MatMenuModule,MatListModule } from '@angular/material';
import {MatDatepickerModule, MatDatepickerToggle} from '@angular/material/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { VirtualViewRoutingModule } from './virtual-view-routing.module';
import { VoTrackingComponent } from './vo-tracking/vo-tracking.component';
import { MainComponent } from './main/main.component';
import { AgmCoreModule } from '@agm/core';
// @ts-ignore
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
// @ts-ignore
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { AgmDirectionModule } from 'agm-direction';

@NgModule({
  declarations: [VoTrackingComponent, MainComponent],
  imports: [
    CommonModule,
    VirtualViewRoutingModule,
    ModalModule.forRoot(),
    FormsModule,
    MatRadioModule,
    AccordionModule.forRoot(),
    MatCardModule,
    MatCheckboxModule,
    MatSliderModule,
    NgxImageZoomModule.forRoot(),
    NgxPaginationModule,
    ResizableModule,
    Ng5SliderModule,
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatButtonModule, MatIconModule, MatTableModule, MatSelectModule, MatNativeDateModule,
    MatListModule,
   MatMenuModule,MatDatepickerModule,
   AgmCoreModule,
   AgmSnazzyInfoWindowModule,
   AgmJsMarkerClustererModule,
   AgmDirectionModule,TabsModule
   
  ]
})
export class VirtualViewModule { }
