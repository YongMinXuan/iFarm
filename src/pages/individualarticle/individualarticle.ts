import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database.service';

/**
 * Generated class for the IndividualarticlePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-individualarticle',
  templateUrl: 'individualarticle.html',
})
export class IndividualarticlePage {
  articles: any = [];
  itemExpandHeight: number = 100;
  roomkey:string;
  private _COLL 		: string 			= "Articles";
  private _COLL2 		: string 			= this.navParams.get("key");
  constructor(public navCtrl: NavController, public navParams: NavParams,private _DB  : DatabaseProvider) {
    this.roomkey = this.navParams.get("key") as string;

  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad IndividualarticlePage');
  }

  retrieveCollection() : void
  {
     this._DB.getIndivarticles(this._COLL,this._COLL2)
     .then((data) =>
     {
        console.log(data);
        // IF we don't have any documents then the collection doesn't exist
        // so we create it!
        if(data.length === 0)
        {
          //  this.generateCollectionAndDocument();
        }

        // Otherwise the collection does exist and we assign the returned
        // documents to the public property of locations so this can be
        // iterated through in the component template
        else
        {
           this.articles = data;
        }
     })
     .catch();
  }

}
