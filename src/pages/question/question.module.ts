import { IonicModule } from 'ionic-angular';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuestionPage } from './question';
@NgModule({
  declarations: [
    QuestionPage,
  ],
  imports: [
    IonicPageModule.forChild(QuestionPage),
    IonicModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class QuestionPageModule {}
