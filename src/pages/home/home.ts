import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import { LoggedinPage } from '../loggedin/loggedin';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    @ViewChild('username') uname;
    @ViewChild('password') password;

    provider = {
     
      name : '',
      profilePicture: '',
      email: '',
      loggedin : false
    }

    
  
    



  constructor(private fire: AngularFireAuth, public navCtrl: NavController, public alertCtrl: AlertController) {


    

  }

  signIn(){

    this.navCtrl.push(LoginPage);

      }


  register(){
    this.navCtrl.push(RegisterPage);
  }

  loginWithGoogle(){
    this.fire.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then (res => {
      console.log(res)
      console.log('from -Google--')

      this.provider.loggedin = true;
      this.provider.name = res.user.displayName;
      this.provider.name = res.user.email;
      this.provider.profilePicture = res.user.photoURL;

    })
  }

  loginWithFacebook(){

    this.fire.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
    .then(res => {

      console.log(res);
       //this.navCtrl.push(LoggedinPage);
      this.provider.loggedin = true;
      this.provider.name = res.user.displayName;
      this.provider.name = res.user.email;
      this.provider.profilePicture = res.user.photoURL;

    })

  }

  logout(){

    this.fire.auth.signOut();
    this.provider.loggedin = false;

  }

  }




