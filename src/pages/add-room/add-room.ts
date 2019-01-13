import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import * as firebase from 'Firebase';
import { DatabaseProvider } from '../../providers/database/database.service';

@IonicPage()
@Component({
  selector: 'page-add-room',
  templateUrl: 'add-room.html',
})
export class AddRoomPage {
  private _COLL 		: string 			= "ChatRooms";

  data = { roomname:'' };
  ref = firebase.database().ref('chatrooms/');

  constructor(public navCtrl: NavController, public navParams: NavParams, private _DB           : DatabaseProvider,
    private _ALERT    : AlertController,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRoomPage');
  }

  addRoom() {
    // let newData = this.ref.push();
    // newData.set({
    //   roomname:this.data.roomname
    // });
    // this.navCtrl.pop();
    this._DB.addDocument(this._COLL,
      {
       roomname : this.data.roomname
    })
.then((data) =>
{
console.log(data);
// this.clearForm();
this.displayAlert('Record added', 'The room was successfully added');
})
.catch((error) =>
{
this.displayAlert('Adding document failed', error.message);
});
  }

  displayAlert(title      : string,
    message    : string) : void
{
let alert : any     = this._ALERT.create({
title      : title,
subTitle   : message,
buttons    : ['Got it!']
});
alert.present();
this.navCtrl.pop();
}

}