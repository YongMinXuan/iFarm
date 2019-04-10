import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the ForgetpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgetpassword',
  templateUrl: 'forgetpassword.html',
})
export class ForgetpasswordPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private toastCtrl: ToastController,private http: HttpClient, private alertCtrl: AlertController,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetpasswordPage');
  }
  email: string = "";
  password: string = "";
  displayAlert(title      : string,
    message    : string) : void
{
let alert : any     = this.alertCtrl.create({
title      : title,
subTitle   : message,
buttons    : [{
text      : 'Got It!',

}]
});
alert.present();
}
  reset(){
    // var admin = require('firebase-admin');
    let body = {
      email: this.email,
      // userId: firebase.auth().currentUser.uid,
    }

    console.log(body);
    let toast = this.toastCtrl.create({
      message: "Contacting our servers now... Please wait."
    });

    toast.present();

    this.http.post("https://ifarmfyp.herokuapp.com/https://us-central1-ifarm-a79f0.cloudfunctions.net/returnemail", JSON.stringify(body), {
      responseType: "text"
    }).subscribe((data) => {
      console.log("Look here")
      console.log(data)
      console.log(data.length)

      if (data.length != 0){
        firebase.auth().sendPasswordResetEmail(this.email).then(function() {
          // Email sent.
          console.log("email is sent")
          this.navCtrl.pop();
          toast.dismiss();

          this.displayAlert('Success', 'The email was successfully sent');
          let ultra = this.toastCtrl.create({
            message: "The email was successfully sent",
            duration: 3000
          }).present();
    
        }).catch(function(error) {
          // An error happened.
          console.log('an error occured')
          console.log(error)
        });
      }

    }, (error) => {
      toast.setMessage("An error has occured. Please try again later.")
      setTimeout(() => {
        toast.dismiss();
      }, 3000)
      console.log(error)
    })

  }

}
