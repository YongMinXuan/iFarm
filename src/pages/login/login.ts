import { LoginResponse } from './../../models/login/login-response.interface';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(private toast: ToastController, private navCtrl: NavController, private navParams: NavParams) {
  }
  navigateToPage(pageName: string){
  pageName === 'TabsPage' ? this.navCtrl.setRoot(pageName) : this.navCtrl.push(pageName);
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
login(event: LoginResponse){
  console.log(event);
  if(!event.error){
    this.toast.create({
      message:`${event.result.uid}`,
      duration:3000
    }).present();
    this.navCtrl.setRoot('EditProfilePage')
  }
  else{
    this.toast.create({
      message:event.error.message,
      duration:3000,
    }).present();
  }
}
}
