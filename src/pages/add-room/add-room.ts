import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ActionSheetController, AlertController, ModalController, Modal } from 'ionic-angular';
import * as firebase from 'Firebase';
import { DatabaseProvider } from '../../providers/database/database.service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HttpClient } from '@angular/common/http';
import { ImagePicker } from '@ionic-native/image-picker';


@IonicPage()
@Component({
  selector: 'page-add-room',
  templateUrl: 'add-room.html',
})
export class AddRoomPage {
  private _COLL 		: string 			= "ChatRooms";
  image: string;

  data = { roomname:'' };
  ref = firebase.database().ref('chatrooms/');

  constructor(public navCtrl: NavController, public navParams: NavParams, private _DB           : DatabaseProvider,
    private _ALERT    : AlertController,private actionSheetCtrl: ActionSheetController,private camera: Camera, private http: HttpClient,public imagePicker: ImagePicker,private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRoomPage');
  }

  addRoom() {

    if(this.image){
      let loading = this.loadingCtrl.create({
        content: "Uploading Image..."
      })
  
      loading.present();
  
      let ref = firebase.storage().ref("GroupImages/" + name);
  
      let uploadTask = ref.putString(this.image.split(',')[1], "base64");
  
      uploadTask.on("state_changed", (taskSnapshot: any) => {
        console.log(taskSnapshot)
        let percentage = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100;
        loading.setContent("Uploaded " + percentage + "% ...")
  
      }, (error) => {
        console.log(error)
      }, () => {
        console.log("The upload is complete!");
  
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
  
          this._DB.addDocument(this._COLL,
            {
             roomname : this.data.roomname,
             image : url
          })
          
        }).catch((err) => {
          loading.dismiss()
          
        })
        
      })
      loading.dismiss()
      this.navCtrl.pop()
    }

    else{
      this._DB.addDocument(this._COLL,
        {
         roomname : this.data.roomname,
         image: "https://firebasestorage.googleapis.com/v0/b/ifarm-a79f0.appspot.com/o/crowd-of-users.png?alt=media&token=890dfb28-fba9-42e3-a813-0ae53f795e64"
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
addPhoto(){
  this.actionSheetCtrl.create({
    buttons: [
      {
        text: "Camera",
        handler: () => {
          console.log();
          console.log("Camera");
          

            this.launchCamera();
            console.log("Before Modal Cntrl")
        
        
          
        }
      },
      {
        text: "Image Gallery",
        handler: () => {
          console.log("Image Gallery");
          this.openImagePicker();

        }
      }
    ]
  }).present();

}

openImagePicker(){
  this.imagePicker.hasReadPermission().then(
    (result) => {

      if(result == false){
        // no callbacks required as this opens a popup which returns async
        this.imagePicker.requestReadPermission();
      }
      else if(result == true){
        const options = {
          maximumImagesCount: 1,
          quality: 75,
          width: 512,
          height: 512,
          outputType: 1
          }

        this.imagePicker.getPictures(options).then(
          (results) => {
           
               this.image = "data:image/jpeg;base64," + results;              
           
          }, (err) => console.log(err)
        );
      }
    }, (err) => {
      console.log(err);
    });
  }

launchCamera() {
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

  this.camera.getPicture(options).then((base64Image) => {
    console.log(base64Image);

    this.image = "data:image/png;base64," + base64Image;


  }).catch((err) => {
    console.log(err)
  })
}

upload(name: string) {

  return new Promise((resolve, reject) => {

    let loading = this.loadingCtrl.create({
      content: "Uploading Image..."
    })

    loading.present();

    let ref = firebase.storage().ref("GroupImages/" + name);

    let uploadTask = ref.putString(this.image.split(',')[1], "base64");

    uploadTask.on("state_changed", (taskSnapshot: any) => {
      console.log(taskSnapshot)
      let percentage = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100;
      loading.setContent("Uploaded " + percentage + "% ...")

    }, (error) => {
      console.log(error)
    }, () => {
      console.log("The upload is complete!");

      uploadTask.snapshot.ref.getDownloadURL().then((url) => {

        this._DB.addDocument(this._COLL,
          {
           roomname : this.data.roomname,
           image : url
        })

      }).catch((err) => {
        loading.dismiss()
        reject()
      })

    })

  })

}
}