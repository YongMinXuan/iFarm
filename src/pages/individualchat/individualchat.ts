import { InboxPage } from './../inbox/inbox';

import { GroupChatMulitpleImagePage } from './../group-chat-mulitple-image/group-chat-mulitple-image';
import { Observable } from 'rxjs/Observable';
import { GroupChatImagePage } from './../group-chat-image/group-chat-image';
import { DatabaseProvider } from './../../providers/database/database.service';
import { User } from './../../models/chat/chats.models';
import { Component, ViewChild, ElementRef } from '@angular/core';
import {  IonicPage,ModalController, ActionSheetController, NavController, NavParams, Content ,AlertController,List,normalizeURL } from 'ionic-angular';
import { RoomPage } from '../room/room';
import * as firebase from 'Firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Subscription } from "rxjs/Subscription";
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
/**
 * Generated class for the IndividualchatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-individualchat',
  templateUrl: 'individualchat.html',
})
export class IndividualchatPage {
  // private _COLL 		: string 			= this.navParams.get("nickname");
  public chatID         : string          = '';
  private _COLL 		: string 			= "Individual_Chats";
  private _COLL2 		: string 			= this.navParams.get("key");
  private mutationObserver: MutationObserver;
 public image: string;
 public images = [];

  // @ViewChild(Content) content: Content;
  @ViewChild(Content) contentArea: Content;
  @ViewChild(List, {read: ElementRef}) chatList: ElementRef;

  data = { type:'', nickname:'', message:'' };
  chats = [];
  roomkey:string;
  nickname:string;
  offStatus:boolean = false;
chatreceive: Subscription;
public base64Image : string;
public photos : any;
public shouldScrollDown: boolean
public showScrollButton: boolean
public chatlength : number;

constructor(public navCtrl: NavController, public navParams: NavParams,private _DB: DatabaseProvider,
  private _ALERT: AlertController,private actionSheetCtrl: ActionSheetController,private camera: Camera,private modalCtrl : ModalController,public imagePicker: ImagePicker,) {
  this.roomkey = this.navParams.get("key") as string;
  this.nickname = firebase.auth().currentUser.displayName as string;
  this.data.type = 'message';
  this.data.nickname = this.nickname;
 this.chatlength = 0

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

scrollcontent(){
 this.contentArea.scrollToBottom();
}

ionViewDidLeave(){
this.chatreceive.unsubscribe();
}

ionViewWillEnter(){
this.chatreceive = Observable.interval(3000).subscribe(()=>{
  this.retrieveCollectionconsistently();
});

   this.retrieveCollection();
   this.contentArea.scrollToBottom();
//   this.mutationObserver = new MutationObserver((mutations) => {
//     this.contentArea.scrollToBottom();
// });

// this.mutationObserver.observe(this.chatList.nativeElement, {
//     childList: true
// });
this.dropdowntolatest()
}

ngOnInit() 
  {
    this.photos = [];
  }



ionViewDidLoad(){
//   this.chatreceive = Observable.interval(3000).subscribe(()=>{
//     this.retrieveCollection();
// });

this.retrieveCollection();
this.contentArea.scrollToBottom();
setTimeout(()=>{this.contentArea.scrollToBottom();},500); 
setTimeout(()=>{this.contentArea.scrollToBottom();},1000); 
//   // setInterval(function(){ this.retrieveCollection()}, 3000);
//   this.mutationObserver = new MutationObserver((mutations) => {
//       this.contentArea.scrollToBottom();
//   });

//   this.mutationObserver.observe(this.chatList.nativeElement, {
//       childList: true
//   });
this.chatreceive = Observable.interval(3000).subscribe(()=>{
this.retrieveCollectionconsistently();
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

dropdowntolatest(){
  this.contentArea.ionScrollEnd.subscribe((data)=>{

    let dimensions = this.contentArea.getContentDimensions();

    let scrollTop = this.contentArea.scrollTop;
    let contentHeight = dimensions.contentHeight;
    let scrollHeight = dimensions.scrollHeight;

    if ( (scrollTop + contentHeight + 20) > scrollHeight) {
      this.shouldScrollDown = true;
      this.showScrollButton = false;
      return true
    } else {
      this.shouldScrollDown = false;
      this.showScrollButton = true;
      return false
    }

  });
}

retrieveCollectionconsistently() : void
{ console.log(this.chatlength)
   this._DB.getChatMessages(this._COLL,this._COLL2)
   .then((data) =>
   {
      console.log(data.length);
      console.log(this.chatlength);
      
      // IF we don't have any documents then the collection doesn't exist
      // so we create it!
      if(data.length > this.chatlength)
      {
        //  this.generateCollectionAndDocument();
        this.chats = data;
        this.chatlength = data.length
        console.log(this.chatlength)
        var currentTime = new Date();
        console.log(currentTime)
        setTimeout(()=>{this.contentArea.scrollToBottom();},500); 
        setTimeout(()=>{this.contentArea.scrollToBottom();},1000); 
      }

      // Otherwise the collection does exist and we assign the returned
      // documents to the public property of locations so this can be
      // iterated through in the component template
      else
      {
        //  this.chats = data;
         console.log('no change')
      }
   })
   .catch();
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
load(chat){
return `https://cors-anywhere.herokuapp.com/${chat}`
}

sendMessage() {

  let type	            : string		= this.data.type,
      user  	            : string		= this.data.nickname,
      message  	            : string		= this.data.message,
      profilepic  	            : string		= firebase.auth().currentUser.photoURL,

      sendDate: Date = new Date();
      this._DB.sendchatmessage(this._COLL, this._COLL2,
        {
          type : type,            
          user : user,
          message :message,
          sendDate : sendDate,
          profilepic :profilepic,
          
      })
.then(async (data) =>
{
console.log(data);

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

this._DB.updateDocument(this._COLL,
  this._COLL2,
  {
     
     name   : user,
     lastmessage : message,
     profilepic :profilepic
     
})
.then((data) =>
{

})
.catch((error) =>
{

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
        this.openImagePicker(data);

      }
    }
  ]
}).present();
}

openImagePicker(data){
this.imagePicker.hasReadPermission().then(
  (result) => {
    this.photos = [];

    if(result == false){
      // no callbacks required as this opens a popup which returns async
      this.imagePicker.requestReadPermission();
    }
    else if(result == true){
      const options = {
        maximumImagesCount: 5,
        quality: 75,
        width: 512,
        height: 512,
        outputType: 1
        }

      this.imagePicker.getPictures(options).then(
        (results) => {
          for (var i = 0; i < results.length; i++) {
                this.base64Image = "data:image/jpeg;base64," + results[i];
                console.log(this.base64Image)
                this.photos.push(this.base64Image);
            }
              console.log(this.photos)
            this.navCtrl.push(GroupChatMulitpleImagePage, {
              "data": data,"image": this.photos, "collection1": this._COLL,"collection2": this._COLL2
            })
          // for (var i = 0; i < results.length; i++) {
          //   this.uploadImageToFirebase(results[i]);
          //   this.navCtrl.push(GroupChatMulitpleImagePage, {
          //     "data": data.id,"image": results[i], "collection1": this._COLL,"collection2": this._COLL2
          //   })
          // this._DB.sendchatmessage(this._COLL, this._COLL2,
          //   result[i]);
          // }
        }, (err) => console.log(err)
      );
    }
  }, (err) => {
    console.log(err);
  });
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
  // this.images.push(this.image)
  console.log(this.images)
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

  this.navCtrl.setRoot(InboxPage, {
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


