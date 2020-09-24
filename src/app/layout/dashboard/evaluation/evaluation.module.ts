import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';

import { EvaluationRoutingModule } from './evaluation-routing.module';
import { HomeComponent } from './home/home.component';
import { DetailsPageComponent } from './details-page/details-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ModalModule } from 'ngx-bootstrap';
import { SectionOneViewComponent } from './section-one-view/section-one-view.component';
import { SectionTwoViewComponent } from './section-two-view/section-two-view.component';
import { FormsModule } from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import { SectionThreeViewComponent } from './section-three-view/section-three-view.component';
import { AccordionModule } from 'ngx-bootstrap';
import { SectionFourViewComponent } from './section-four-view/section-four-view.component';
import { MatCardModule, MatFormFieldModule } from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSliderModule} from '@angular/material/slider';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { SectionFiveComponent } from './section-five/section-five.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { ResizableModule } from 'angular-resizable-element';
import { Ng5SliderModule } from 'ng5-slider';
import { SectionSixComponent } from './section-six/section-six.component';
import {MatInputModule} from '@angular/material/input';
import { SectionSevenViewComponent } from './section-seven-view/section-seven-view.component';
import { SectionNineViewComponent } from './section-nine-view/section-nine-view.component';
import { SectionEightViewComponent } from './section-eight-view/section-eight-view.component';
import { SectionTenViewComponent } from './section-ten-view/section-ten-view.component';
@NgModule({
  declarations: [HomeComponent, DetailsPageComponent, MainPageComponent,
    SectionOneViewComponent, SectionTwoViewComponent,
     SectionThreeViewComponent, SectionFourViewComponent,
     SectionFiveComponent, SectionSixComponent, SectionSevenViewComponent, SectionNineViewComponent, SectionEightViewComponent, SectionTenViewComponent],
  imports: [
    CommonModule,
    EvaluationRoutingModule,
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
    MatExpansionModule
  ]
})
export class EvaluationModule { }
