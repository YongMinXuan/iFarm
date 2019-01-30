
import { ChatsPage } from './../chats/chats';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,LoadingController  } from 'ionic-angular';
import firebase from 'firebase';
import moment from 'moment';
import { DatabaseProvider } from './../../providers/database/database.service';

/**
 * Generated class for the GroupChatMulitpleImagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-chat-mulitple-image',
  templateUrl: 'group-chat-mulitple-image.html',
})
export class GroupChatMulitpleImagePage {

  post: any = {};
  collection1: any = {};
  collection2: any = {};
  image: any = {};
  comments : any[] = [];
  data = { type:'', nickname:'', message:'' };
  roomkey:string;
  nickname:string;
  offStatus:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController,private _DB: DatabaseProvider, private loadingCtrl: LoadingController) {
    this.roomkey = this.navParams.get("key") as string;
    this.nickname = firebase.auth().currentUser.displayName as string;
    this.data.type = 'message';
    this.data.nickname = this.nickname;

    this.post = this.navParams.get("data");
    this.image = this.navParams.get("image");
    this.collection1 = this.navParams.get("collection1");
    this.collection2 = this.navParams.get("collection2");
    // console.log(this.post)
    console.log(this.image)
    console.log(typeof this.image)
    console.log(this.image.length)
    console.log(this.image[0])

    // firebase.firestore().collection("comments")
    // .where("post", "==", this.post.id)
    // .orderBy("created", "asc")
    // .get()
    // .then((data) => {
    //   this.comments = data.docs;
    // }).catch((err) => {
    //   console.log(err)
    // })

  }

  

  uploadImages(imagedir){
    return new Promise<any>((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      let imageRef = storageRef.child('image').child('imageName');
      this.encodeImageUri(imagedir, function(image64){
        imageRef.putString(image64, 'data_url')
        .then(snapshot => {
          console.log("Hello look here for snapshot")
          console.log(typeof snapshot)
          console.log(snapshot)
          console.log(snapshot.downloadURL)
          resolve(snapshot.downloadURL)
        }, err => {
          reject(err);
        })
      })
    })
  }

  encodeImageUri(imageUri, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      var aux:any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg");
      console.log('this is the shit.')
      console.log(dataURL)
      callback(dataURL);
    };
    img.src = imageUri;
    // console.log(image.src)
  };

  sendImage(){
    return new Promise((resolve, reject) => {

      // let loading = this.loadingCtrl.create({
      //   content: "Uploading Image..."
      // })
      
      let loading = this.loadingCtrl.create({
        content: "Uploading Image..."
      })

      loading.present();
      // loading.present();
      for (var i = 0; i < this.image.length; i++){

       
      
      const filename = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      let ref = firebase.storage().ref("coolImages/" + filename);

    
   
      let uploadTask = ref.putString(this.image[i].split(',')[1], "base64");
     

      uploadTask.on("state_changed", (taskSnapshot: any) => {
        console.log(taskSnapshot)
        // let percentage = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100;
        // loading.setContent("Uploaded " + percentage + "% ...")
  
      }, (error) => {
        console.log(error)
      }, () => {
        console.log("The upload is complete!");
  
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
  console.log(url);
          let type	            : string		= this.data.type,
        user  	            : string		=   this.data.nickname,
        message  	            : string		= " ",
        image  	            : string		=  url,
        sendDate: Date = new Date();

        this._DB.sendchatmessage(this.collection1, this.collection2,
          {
            type : type,            
            user : user,
            message :message,
            sendDate : sendDate,
            image: image
        })
.then(async (data) =>
{
console.log(data);
// if (this.image) {
//   await this.upload(this._COLL, this._COLL2, data.id)
// }
// this.clearForm();
// this.displayAlert();

// this.retrieveCollection();
// this.contentArea.scrollToBottom();
// this.data.message = "";
// this.contentArea.scrollToBottom();
this.image = [];
while (this.image.length !== 0) {
  this.image.pop()
}
this.image.length = 0
console.log(this.image)
this.viewCtrl.dismiss();
loading.dismiss();
})
.catch((error) =>
{
console.log(error)
});
  }).catch((error) =>
  {
  console.log(error)
  }
  
      )})
  
  
    
  
      }

      this._DB.updateDocument(this.collection1,
        this.collection2,
        {
           
           name   : this.data.nickname,
           lastmessage : "Image"
           
      })
      .then((data) =>
      {
      
      })
      .catch((error) =>
      {
      
      });
  }

)}

  // close(){
  //   this.viewCtrl.dismiss();
  // }

 
  ionViewDidLoad() {
    console.log('ionViewDidLoad CommemtPage');
    
  }


}
