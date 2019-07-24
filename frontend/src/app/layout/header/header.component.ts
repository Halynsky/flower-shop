import { Component } from '@angular/core';
import { SecurityService } from "../../services/security.service";
import { BucketService } from "../../services/bucket.service";
import { ModalWindowService } from "../../services/modal-window.service";
import {UserSidebarComponent} from "../../components/user/user-cabinet-sidebar/user-sidebar.component";
import {UserCabinetService} from "../../services/user-cabinet.service";

@Component({
  selector: 'layout-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})

export class HeaderComponent {

  constructor(private securityService: SecurityService, private bucketService: BucketService, private modalWindowService: ModalWindowService, private userService: UserCabinetService) {

  }


}

