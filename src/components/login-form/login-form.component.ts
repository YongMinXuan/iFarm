import { LoginResponse } from './../../models/login/login-response.interface';
import { Account } from './../../models/account/account.interface';
import { AngularFireAuth } from 'angularfire2/auth';
import { NavController } from 'ionic-angular';
import { Component,EventEmitter,Output } from '@angular/core';




/**
 * Generated class for the LoginFormComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-login-form',
  templateUrl: 'login-form.component.html'
})
export class LoginFormComponent {

  text: string;
  account = {} as Account;
  @Output() loginStatus: EventEmitter<LoginResponse>;
  constructor(private afAuth : AngularFireAuth, private navCtrl : NavController) {
    console.log('Hello LoginFormComponent Component');
    this.text = 'Hello World';
    this.loginStatus = new EventEmitter<any>();
  }

  navigateToPage(pageName: string){
    pageName === 'TabsPage' ? this.navCtrl.setRoot(pageName) : this.navCtrl.push(pageName);
  }

  async login(){
    try{
      const result: LoginResponse  = {
            result: await this.afAuth.auth.signInWithEmailAndPassword(this.account.email, this.account.password)
          }
          this.loginStatus.emit(result);
        }
   catch(e){
     console.error(e)
     const error : LoginResponse = {
       error: e
     }
     this.loginStatus.emit(error);
   }
  }

}
