
import { GroupChatMulitpleImagePage } from './../group-chat-mulitple-image/group-chat-mulitple-image';
import { Observable } from 'rxjs/Observable';
import { GroupChatImagePage } from './../group-chat-image/group-chat-image';
import { DatabaseProvider } from './../../providers/database/database.service';
import { User } from './../../models/chat/chats.models';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { App, IonicPage,ModalController, ActionSheetController, NavController, NavParams, Content ,AlertController,List,normalizeURL ,ToastController} from 'ionic-angular';
import { RoomPage } from '../room/room';
import * as firebase from 'Firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Subscription } from "rxjs/Subscription";
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';

@IonicPage()
@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html',
})
export class InboxPage {

  rooms = [];
  ref = firebase.database().ref('chatrooms/');
  private _COLL 		: string 			= "Individual_Chats";
  public displayname = firebase.auth().currentUser.displayName;
  caOrCoCities$: Observable<any>;
  chatreceive: Subscription;
  constructor(public navCtrl: NavController, public navParams: NavParams,private _DB  : DatabaseProvider,
    private _ALERT    : AlertController,private toastCtrl: ToastController,private app: App,) {
    // this.ref.on('value', resp => {
    //   this.rooms = [];
    //   this.rooms = snapshotToArray(resp);
    // });
    let displayname = firebase.auth().currentUser.displayName;
      console.log(displayname)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoomPage');
    this.retrieveCollection();
    this.chatreceive = Observable.interval(3000).subscribe(()=>{
      this.retrieveCollection();
      
      });
  }

  ionViewDidLeave(){
    this.chatreceive.unsubscribe();
    }

  ionViewDidEnter()
  {
     this.retrieveCollection();
  }

room(){
  
}



  joinRoom(key) {
    this.navCtrl.setRoot('IndividualchatPage', {
      key:key,
      nickname:this.navParams.get("nickname")
    });
  }

  retrieveCollection() : void
  {
    console.log("Did the retrieve load.")
    let name = firebase.auth().currentUser.uid
     this._DB.getChatsList(this._COLL, name )
     .then((data) =>
     {
        // IF we don't have any documents then the collection doesn't exist
        // so we create it!
        if(data.length === 0)
        {
          this._DB.getChatsList2(this._COLL , name )
          .then((data) =>
     {
        // IF we don't have any documents then the collection doesn't exist
        // so we create it!
        if(data.length === 0)
        {
          
        }

        // Otherwise the collection does exist and we assign the returned
        // documents to the public property of locations so this can be
        // iterated through in the component template
        else
        {
           this.rooms = data;
           
        }
     })
     .catch();
        }

        // Otherwise the collection does exist and we assign the returned
        // documents to the public property of locations so this can be
        // iterated through in the component template
        else
        {
           this.rooms = data;
        }
     })
     .catch();
  }

  logout() {

    firebase.auth().signOut().then(() => {

      let toast = this.toastCtrl.create({
        message: "You have been logged out successfully.",
        duration: 3000
      }).present();

      // this.navCtrl.setRoot('LoginPage');
      this.app.getRootNav().setRoot('LoginPage');


    });

  }

  deleteDocument(obj) : void
   {
      this._DB.deleteDocument(this._COLL,
      						obj.id)
      .then((data : any) =>
      {
         this.displayAlert('Success', 'The chat was successfully removed');
      })
      .catch((error : any) =>
      {
         this.displayAlert('Error', error.message);
      });
   }
 /**
    * Provide feedback to user after an operation has succeeded/failed
    *
    * @public
    * @method displayAlert
    * @param  title          {String}           Heading for alert message
    * @param  message        {String}           Content for alert message
    * @return {none}
    */
   displayAlert(title      : string,
    message    : string) : void
{
let alert : any     = this._ALERT.create({
title      : title,
subTitle   : message,
buttons    : [{
text      : 'Got It!',
handler   : () =>
{
this.retrieveCollection();
}
}]
});
alert.present();
}
}