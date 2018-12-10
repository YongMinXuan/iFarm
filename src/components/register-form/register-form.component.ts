import { LoginResponse } from './../../models/login/login-response.interface';
import { AuthService } from './../../providers/auth/auth.service';
import { Account } from './../../models/account/account.interface';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, Output, EventEmitter } from '@angular/core';
import {ToastController} from 'ionic-angular';




/**
 * Generated class for the RegisterFormComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@Component({
  selector: 'app-register-form',
  templateUrl: 'register-form.component.html'
})
export class RegisterFormComponent {

  text: string;
  account = {} as Account;
  @Output() registerStatus: EventEmitter<LoginResponse>;

  constructor(private auth: AuthService, private toast: ToastController) {
    this.registerStatus = new EventEmitter<LoginResponse>();
  }

  async register(){
    try{
   const result = await this.auth.createUserWithEmailAndPassword(this.account);
   this.registerStatus.emit(result);
   this.toast.create({
    message:"Account Successfully Created",
    duration:3000
  }).present();
  console.log(result);
  }

  catch(e){
    console.log(e);
    this.toast.create({
      message:e.message,
      duration:3000
    }).present();
    this.registerStatus.emit(e);
  }
  }
}
