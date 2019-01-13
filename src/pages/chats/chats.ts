import { Observable } from 'rxjs/Observable';
import { GroupChatImagePage } from './../group-chat-image/group-chat-image';
import { DatabaseProvider } from './../../providers/database/database.service';
import { User } from './../../models/chat/chats.models';
import { Component, ViewChild, ElementRef } from '@angular/core';
import {  IonicPage,ModalController, ActionSheetController, NavController, NavParams, Content ,AlertController,List } from 'ionic-angular';
import { RoomPage } from '../room/room';
import * as firebase from 'Firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Subscription } from "rxjs/Subscription";
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
 public image: string;

  // @ViewChild(Content) content: Content;
  @ViewChild(Content) contentArea: Content;
  @ViewChild(List, {read: ElementRef}) chatList: ElementRef;

  data = { type:'', nickname:'', message:'' };
  chats = [];
  roomkey:string;
  nickname:string;
  offStatus:boolean = false;
 observableVar: Subscription;



  constructor(public navCtrl: NavController, public navParams: NavParams,private _DB: DatabaseProvider,
    private _ALERT: AlertController,private actionSheetCtrl: ActionSheetController,private camera: Camera,private modalCtrl : ModalController) {
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

    // setInterval(function(){ this.retrieveCollection()}, 3000);
  }

  chatreceive = Observable.interval(3000).subscribe(()=>{
    this.retrieveCollection();
});

ionViewDidLeave(){
  this.chatreceive.unsubscribe();
}

ionViewWillEnter(){
 
  
     this.retrieveCollection();
    //  this.content.scrollToBottom();
    this.mutationObserver = new MutationObserver((mutations) => {
      this.contentArea.scrollToBottom();
  });

  this.mutationObserver.observe(this.chatList.nativeElement, {
      childList: true
  });
  
}



ionViewDidLoad(){
  this.retrieveCollection();
  // setInterval(function(){ this.retrieveCollection()}, 3000);
  this.mutationObserver = new MutationObserver((mutations) => {
      this.contentArea.scrollToBottom();
  });

  this.mutationObserver.observe(this.chatList.nativeElement, {
      childList: true
  });

}


  // ionViewDidLoad()
  // {
  //    this.retrieveCollection();
  //   //  this.content.scrollToBottom();
  //   this.mutationObserver = new MutationObserver((mutations) => {
  //     this.contentArea.scrollToBottom();
  // });

  // this.mutationObserver.observe(this.chatList.nativeElement, {
  //     childList: true
  // });
  // }
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
load(chat){
  return `https://cors-anywhere.herokuapp.com/${chat}`
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
.then(async (data) =>
{
console.log(data);
// if (this.image) {
//   await this.upload(this._COLL, this._COLL2, data.id)
// }
// this.clearForm();
this.displayAlert();

this.retrieveCollection();
this.contentArea.scrollToBottom();
this.data.message = "";
this.contentArea.scrollToBottom();
this.image = "";
})
.catch((error) =>
{
this.displayAlert();
});
  }

  displayAlert() : void
{

}

addimage(data){
  console.log(data);
  this.actionSheetCtrl.create({
    buttons: [
      {
        text: "Camera",
        handler: () => {
          console.log(data);
          console.log("Camera");
          let dataing = data;

            this.launchCamera(data);
            console.log("Before Modal Cntrl")
        
        
          
        }
      },
      {
        text: "Image Gallery",
        handler: () => {
          console.log(data);
          console.log("Image Gallery");
          

        }
      }
    ]
  }).present();
}

launchCamera(data) {
  let options: CameraOptions = {
    quality: 100,
    sourceType: this.camera.PictureSourceType.CAMERA,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.PNG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    targetHeight: 512,
    targetWidth: 512,
    allowEdit: true
  }
  console.log(data)

  this.camera.getPicture(options).then((base64Image) => {
    // console.log(base64Image);

    this.image = "data:image/png;base64," + base64Image;
    console.log(data.id)
    console.log(this._COLL)
    console.log(this._COLL2)
 this.navCtrl.push(GroupChatImagePage, {
    "data": data.id,"image": this.image, "collection1": this._COLL,"collection2": this._COLL2
  })

  }).catch((err) => {
    console.log(err)
  })

 

}

upload(_COLL: string, _COLL2: string,data : string) {

  return new Promise((resolve, reject) => {

    // let loading = this.loadingCtrl.create({
    //   content: "Uploading Image..."
    // })

    // loading.present();

    let ref = firebase.storage().ref("postImages/" + name);

    let uploadTask = ref.putString(this.image.split(',')[1], "base64");

    uploadTask.on("state_changed", (taskSnapshot: any) => {
      console.log(taskSnapshot)
      // let percentage = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100;
      // loading.setContent("Uploaded " + percentage + "% ...")

    }, (error) => {
      console.log(error)
    }, () => {
      console.log("The upload is complete!");

      uploadTask.snapshot.ref.getDownloadURL().then((url) => {

        firebase.firestore().collection(_COLL).doc(_COLL2).collection("messages").doc(data).update({
          image: url
        }).then(() => {
          // loading.dismiss()
          console.log('success')
          resolve()
        }).catch((err) => {
          // loading.dismiss()
          console.log('fail')
          reject()
        })

      }).catch((err) => {
        // loading.dismiss()
        console.log('fail2')
        reject()
      })

    })

  })

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
