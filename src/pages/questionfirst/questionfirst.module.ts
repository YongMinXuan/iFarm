import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuestionFirstPage } from './questionfirst';

@NgModule({
  declarations: [
    QuestionFirstPage,
  ],
  imports: [
    IonicPageModule.forChild(QuestionFirstPage),
  ],
})
export class QuestionfirstPageModule {}
