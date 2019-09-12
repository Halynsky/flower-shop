import { Component, OnInit } from "@angular/core";
import {UserCabinetService} from "../../../services/user-cabinet.service";

@Component({
  selector: 'user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.scss']
})

export class UserSidebarComponent implements OnInit{

  private permanentId;

  constructor(public userService: UserCabinetService){

  }

  ngOnInit(): void {
    this.activateButton(this.userService.getId())
  }

  activateButton(id) {
    if (this.permanentId){
      document.getElementById(this.permanentId).style.backgroundColor = 'white';
    }
    document.getElementById(id).style.backgroundColor = '#e0e0e0';
    this.permanentId = id;
  }


}
