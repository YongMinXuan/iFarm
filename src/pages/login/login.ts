import {Component, OnDestroy} from '@angular/core';
import {NavController, NavParams, IonicPage, ToastController} from 'ionic-angular';
import {LoginResponse} from "../../models/login/login-response.interface";
import {DataService} from "../../providers/data/data.service";
import {Subscription} from "rxjs/Subscription";
import {User} from "firebase";
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email: string = "";
  password: string = "";

  constructor(public navCtrl: NavController, public toastCtrl: ToastController) {

  }

  login(){

    firebase.auth().signInWithEmailAndPassword(this.email, this.password)
    .then((user) => {
      console.log(user)
      console.log("look here")
      console.log(user.user)
      console.log(user.user.displayName)
      console.log(firebase.auth().currentUser.displayName)
      this.toastCtrl.create({
        message: "Welcome " + user.user.displayName,
        duration: 3000
      }).present();

      this.navCtrl.setRoot('TabsPage')

    }).catch((err) => {
      console.log(err)
      this.toastCtrl.create({
        message: err.message,
        duration: 3000
      }).present();
    })

  }

  gotoSignup(){
    this.navCtrl.push("RegisterPage");
  }

  gotoreset(){
    this.navCtrl.push("ForgetpasswordPage");
  }

}
// export class LoginPage implements OnDestroy{

//   private profile$: Subscription;

//   constructor(private data: DataService,
//               private toast: ToastController,
//               private navCtrl: NavController,
//               private navParams: NavParams) {
//   }

//   login(event: LoginResponse) {
//     console.log(event); //check event object
//     if (!event.error) {
//       this.toast.create({
//         message: `Welcome to OPSAP, ${event.result.email}`,
//         duration: 3000
//       }).present();

//       this.profile$ = this.data.getProfile(<User>event.result)
//         .snapshotChanges()
//         .subscribe(res => {
//           console.log(res.payload.val());
//           res.payload.val() ? this.navCtrl.setRoot('TabsPage') : this.navCtrl.setRoot('EditProfilePage')
//         });
//     }
//     else {
//       this.toast.create({
//         message: event.error.message,
//         duration: 3000
//       }).present()
//     }
//   }

//   ngOnDestroy() {
//     this.profile$.unsubscribe();
//   }

// }