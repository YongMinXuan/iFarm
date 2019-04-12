import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import * as firebase from 'Firebase';
import { DatabaseProvider } from '../../providers/database/database.service';
import { IndividualarticlePage } from '../individualarticle/individualarticle';
/**
 * Generated class for the ArticlesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-articles',
  templateUrl: 'articles.html',
})
export class ArticlesPage {
  articles: any = [];
    itemExpandHeight: number = 100;
    private _COLL 		: string 			= "Articles";

    constructor(public navCtrl: NavController,private _DB  : DatabaseProvider,public navParams: NavParams) {

       

    }

    ionViewCanEnter(){
     this.retrieveCollection();
    }

    retrieveCollection() : void
  {
     this._DB.getArticles(this._COLL)
     .then((data) =>
     {
        console.log(data);
        
        if(data.length === 0)
        {
          
        }

        
        else
        {
           this.articles = data;
        }
     })
     .catch();
  }

  joinRoom(key) {
    this.navCtrl.setRoot(IndividualarticlePage, {
      key:key,
      nickname:this.navParams.get("nickname")
    });
  }
}
