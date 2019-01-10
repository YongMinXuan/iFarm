import { User } from './../../models/chat/chats.models';
import { Component, ViewChild, ElementRef } from '@angular/core';
import {  IonicPage, NavController, NavParams, Content ,AlertController,List } from 'ionic-angular';
import { RoomPage } from '../room/room';
import * as firebase from 'Firebase';
import { DatabaseProvider } from '../../providers/database/database.service';

/**
 * Generated class for the ChatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {
  public chatID         : string          = '';
  private _COLL 		: string 			= "ChatRooms";
  private _COLL2 		: string 			= this.navParams.get("key");
  private mutationObserver: MutationObserver;

  // @ViewChild(Content) content: Content;
  @ViewChild(Content) contentArea: Content;
  @ViewChild(List, {read: ElementRef}) chatList: ElementRef;

  data = { type:'', nickname:'', message:'' };
  chats = [];
  roomkey:string;
  nickname:string;
  offStatus:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,private _DB: DatabaseProvider,
    private _ALERT        : AlertController) {
    this.roomkey = this.navParams.get("key") as string;
    this.nickname = firebase.auth().currentUser.displayName as string;
    this.data.type = 'message';
    this.data.nickname = this.nickname;

    // let joinData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
    // joinData.set({
    //   type:'join',
    //   user:this.nickname,
    //   message:this.nickname+' has joined this room.',
    //   sendDate:Date()
    // });
    // this.data.message = '';

    // firebase.database().ref('chatrooms/'+this.roomkey+'/chats').on('value', resp => {
    //   this.chats = [];
    //   this.chats = snapshotToArray(resp);
    //   setTimeout(() => {
    //     if(this.offStatus === false) {
    //       this.content.scrollToBottom(300);
    //     }
    //   }, 1000);
    // });
  }
  ionViewDidEnter()
  {
     this.retrieveCollection();
    //  this.content.scrollToBottom();
    this.mutationObserver = new MutationObserver((mutations) => {
      this.contentArea.scrollToBottom();
  });

  this.mutationObserver.observe(this.chatList.nativeElement, {
      childList: true
  });
  }
  retrieveCollection() : void
  {
     this._DB.getChatMessages(this._COLL,this._COLL2)
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
           this.chats = data;
        }
     })
     .catch();
  }


  sendMessage() {
    // let newData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
    // newData.set({
    //   type:this.data.type,
    //   user:this.data.nickname,
    //   message:this.data.message,
    //   sendDate:Date()
    // });
    // this.data.message = '';

    let type	            : string		= this.data.type,
        user  	            : string		= this.data.nickname,
        message  	            : string		= this.data.message,
        sendDate: Date = new Date();
        this._DB.sendchatmessage(this._COLL, this._COLL2,
          {
            type : type,            
            user : user,
            message :message,
            sendDate : sendDate
        })
.then((data) =>
{
console.log(data);
// this.clearForm();
this.displayAlert();

this.retrieveCollection();
this.contentArea.scrollToBottom();
this.data.message = "";
this.contentArea.scrollToBottom();

})
.catch((error) =>
{
this.displayAlert();
});
  }

  displayAlert() : void
{

}

  exitChat() {
    let exitData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
    exitData.set({
      type:'exit',
      user:this.nickname,
      message:this.nickname+' has exited this room.',
      sendDate:Date()
    });

    this.offStatus = true;

    this.navCtrl.setRoot(RoomPage, {
      nickname:this.nickname
    });
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

}
