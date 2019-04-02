import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController, } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams,private toastCtrl: ToastController,private http: HttpClient) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetpasswordPage');
  }
  email: string = "";
  password: string = "";

  reset(){
    // var admin = require('firebase-admin');
    let body = {
      email: this.email,
      // userId: firebase.auth().currentUser.uid,
    }

    console.log(body);
    let toast = this.toastCtrl.create({
      message: "Updating like... Please wait."
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
