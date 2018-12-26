import { QuestionFirstPage } from './../questionfirst/questionfirst';
import { FeedPage } from './../feed/feed';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EventPage } from '../event/event';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root: string;
  tab2Root: string;
  tab3Root = QuestionFirstPage;
  tab4Root: string;
  tab5Root = FeedPage;

  constructor(){
    this.tab1Root = 'InboxPage';
    this.tab2Root = 'ChannelsPage';
    // this.tab3Root = 'QuestionPage';
    this.tab4Root = 'WeatherPage';
    // this.tab5Root = 'FeedPage';
    // this.tab5Root = FeedPage;
  }

 

}
