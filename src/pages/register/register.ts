import { Component } from '@angular/core';
import {NavController, NavParams, IonicPage, ToastController,AlertController} from 'ionic-angular';
import {LoginResponse} from "../../models/login/login-response.interface";
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  name: string = "";
  email: string = "";
  password: string = "";

  constructor(private toast: ToastController, public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController){
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
    firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
    .then((data) => {
      
      console.log(data)

      let newUser: firebase.User = data.user;
      newUser.updateProfile({
        displayName: this.name,
        photoURL: ""
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

      }).catch((err) => {
        console.log(err)
      })

    }).catch((err) => {
      console.log(err)
      this.toast.create({
        message: err.message,
        duration: 3000
      }).present();
    })
  }

  goBack(){
    this.navCtrl.pop();
  }

}