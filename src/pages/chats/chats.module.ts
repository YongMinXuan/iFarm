import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatsPage } from './chats';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    ChatsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatsPage),
    IonicImageLoader

  ],
})
export class ChatsPageModule {}
