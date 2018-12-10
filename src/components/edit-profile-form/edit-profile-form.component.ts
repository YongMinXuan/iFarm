import { Profile } from './../../models/profile/profile.interface';
import { Component } from '@angular/core';

/**
 * Generated class for the EditProfileFormComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-edit-profile-form',
  templateUrl: 'edit-profile-form.component.html'
})
export class EditProfileFormComponent {

  text: string;
  profile = {} as Profile;

  constructor() {
    console.log('Hello EditProfileFormComponent Component');
    this.text = 'Hello World';
  }

  async saveProfile() {
   
  }
}
