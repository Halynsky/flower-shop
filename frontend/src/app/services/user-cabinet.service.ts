import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class UserCabinetService {

  private permanentId;

  activateButton(id) {
     setTimeout(() => {
      if (this.permanentId){
        document.getElementById(this.permanentId).style.backgroundColor = 'white';
      }
      document.getElementById(id).style.backgroundColor = '#e0e0e0';
      this.permanentId = id;
     }, 1);

  }



}

