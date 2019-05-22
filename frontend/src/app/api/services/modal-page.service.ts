import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class ModalPageService {
  private isModal: boolean;

  getIsModal() {
    return this.isModal;
  }

  showModal() {
    this.isModal = true;
  }

  hideModal() {
    this.isModal = false;
  }

}
