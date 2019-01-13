import { ChatsPage } from './../chats/chats';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,LoadingController  } from 'ionic-angular';
import firebase from 'firebase';
import moment from 'moment';
import { DatabaseProvider } from './../../providers/database/database.service';

/**
 * Generated class for the GroupChatImagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-chat-image',
  templateUrl: 'group-chat-image.html',
})
export class GroupChatImagePage {
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
    console.log(this.post)
    // console.log(this.image)

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

  sendImage(){
    return new Promise((resolve, reject) => {

      // let loading = this.loadingCtrl.create({
      //   content: "Uploading Image..."
      // })
  
      // loading.present();

      let type	            : string		= this.data.type,
        user  	            : string		= this.data.nickname,
        message  	            : string		= this.data.message,
        sendDate: Date = new Date();
        this._DB.sendchatmessage(this.collection1, this.collection2,
          {
            type : type,            
            user : user,
            message :message,
            sendDate : sendDate
        })
.then((data) =>
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
// this.image = "";
let ref = firebase.storage().ref("postImages/" + name);
  
      let uploadTask = ref.putString(this.image.split(',')[1], "base64");
      let loading = this.loadingCtrl.create({
        content: "Uploading Image..."
      })

      loading.present();

  
      uploadTask.on("state_changed", (taskSnapshot: any) => {
        console.log(taskSnapshot)
        let percentage = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100;
        loading.setContent("Uploaded " + percentage + "% ...")
  
      }, (error) => {
        console.log(error)
      }, () => {
        console.log("The upload is complete!");
  
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
  
          firebase.firestore().collection(this.collection1).doc(this.collection2).collection("messages").doc(data.id).update({
            image: url
          }).then(() => {
            loading.dismiss()
            console.log('success')
            this.viewCtrl.dismiss();
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
.catch((error) =>
{
// this.displayAlert();
console.log(error)
});
  
      
  
    })
  }

  close(){
    this.viewCtrl.dismiss();
  }

  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CommemtPage');
  }

}
