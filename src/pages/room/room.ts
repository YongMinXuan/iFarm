import { ChatsPage } from './../chats/chats';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AddRoomPage } from '../add-room/add-room';
import * as firebase from 'Firebase';
import { DatabaseProvider } from '../../providers/database/database.service';


@IonicPage()
@Component({
  selector: 'page-room',
  templateUrl: 'room.html',
})
export class RoomPage {

  rooms = [];
  ref = firebase.database().ref('chatrooms/');
  private _COLL 		: string 			= "ChatRooms";

  constructor(public navCtrl: NavController, public navParams: NavParams,private _DB  : DatabaseProvider,
    private _ALERT    : AlertController,) {
    // this.ref.on('value', resp => {
    //   this.rooms = [];
    //   this.rooms = snapshotToArray(resp);
    // });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoomPage');
  }

  ionViewDidEnter()
  {
     this.retrieveCollection();
  }

  addRoom() {
    this.navCtrl.push(AddRoomPage);
  }

  joinRoom(key) {
    this.navCtrl.setRoot(ChatsPage, {
      key:key,
      nickname:this.navParams.get("nickname")
    });
  }
  retrieveCollection() : void
  {
     this._DB.getChats(this._COLL)
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
           this.rooms = data;
        }
     })
     .catch();
  }
}

export const snapshotToArray = snapshot => {
    let returnArr = [];

    snapshot.forEach(childSnapshot => {
        let item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });

    return returnArr;
};