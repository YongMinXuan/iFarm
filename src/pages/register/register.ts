
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ActionSheetController, AlertController, ModalController, Modal } from 'ionic-angular';
import firebase from 'firebase';
import moment from 'moment';
import { LoginPage } from '../login/login';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HttpClient } from '@angular/common/http';
import { CommentsPage } from '../comments/comments';
import { Firebase } from '@ionic-native/firebase'
import {App, } from 'ionic-angular';
import { DatabaseProvider } from './../../providers/database/database.service';
import { ImagePicker } from '@ionic-native/image-picker';
import { Component } from '@angular/core';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  name: string = "";
  email: string = "";
  password: string = "";
  image: string;
  profile: string;

  constructor(private toast: ToastController, private app: App, public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private camera: Camera, private http: HttpClient, private actionSheetCtrl: ActionSheetController, private _DB     : DatabaseProvider, private alertCtrl: AlertController, private modalCtrl: ModalController, private firebaseCordova: Firebase,public imagePicker: ImagePicker,){
  }
  addPhoto() {

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

  // register(event: LoginResponse){
  //   console.log(event);
  //   if(!event.error) {
  //     this.toast.create({
  //       message: `Account created: ${event.result.email}`,
  //       duration: 3000
  //     }).present()
  //   }
  //   else {
  //     this.toast.create({
  //       message: `Account not created. ${event.error.message}`
  //     }).present()
  //   }
  // }
  signup(){
    let loading = this.loadingCtrl.create({
      content: "Uploading Image..."
    })
    loading.present();

    firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
    .then((data) => {
      
      console.log(data)
      let ref = firebase.storage().ref("ProfileImages/" + data.user.uid);

      let uploadTask = ref.putString(this.image.split(',')[1], "base64");

      uploadTask.on("state_changed", (taskSnapshot: any) => {
        console.log(taskSnapshot)
        let percentage = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100;
        loading.setContent("Uploaded " + percentage + "% ...")

      }, (error) => {
        console.log(error)
      },() => {
        console.log("The upload is complete!");

        uploadTask.snapshot.ref.getDownloadURL().then((url) => {

          let newUser: firebase.User = data.user;
          newUser.updateProfile({
            displayName: this.name,
            photoURL: url
          }).then(() => {
            console.log("Profile Updated")
    
            this.alertCtrl.create({
              title: "Account Created",
              message: "Your account has been created successfully.",
              buttons: [
                {
                  text: "OK",
                  handler: () => {
                    //Navigate to the feeds page
                    this.navCtrl.setRoot('TabsPage')
                  }
                }
              ]
            }).present();
            loading.dismiss()
          }).catch((err) => {
            console.log(err)
            loading.dismiss()
          })
    
        }).catch((err) => {
          console.log(err)
          this.toast.create({
            message: err.message,
            duration: 3000
          }).present();
        })

        })

      })
      
      
     


    

      
 

    
  }

  goBack(){
    this.navCtrl.pop();
  }

  upload(name: string) {

    return new Promise((resolve, reject) => {

      let loading = this.loadingCtrl.create({
        content: "Uploading Image..."
      })

      loading.present();

      let ref = firebase.storage().ref("ProfileImages/" + name);

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

          

        }).catch((err) => {
          loading.dismiss()
          reject()
        })

      })

    })

  }

}