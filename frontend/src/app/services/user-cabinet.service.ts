import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class UserCabinetService {

  private id;

  setId(id) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

}

