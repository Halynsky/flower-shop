import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class UserCabinetService {


  private permanentElement;
  private currentUrl: string;
  private greyColorHex = '#e0e0e0';

  changeButtonColor(url) {
    this.currentUrl = url;
    switch (this.currentUrl) {
      case 'profile': {
        if (this.permanentElement) {
          this.permanentElement.style.backgroundColor = 'white';
        }
        document.getElementById(`${this.currentUrl}-id`).style.backgroundColor = `${this.greyColorHex}`;
        this.permanentElement = document.getElementById(`${this.currentUrl}-id`);
        break;
      }
      case 'wishlist': {
        if (this.permanentElement) {
          this.permanentElement.style.backgroundColor = 'white';
        }
        document.getElementById(`${this.currentUrl}-id`).style.backgroundColor = `${this.greyColorHex}`;
        this.permanentElement = document.getElementById(`${this.currentUrl}-id`);
        break;
      }
      case 'purchases': {
        if (this.permanentElement) {
          this.permanentElement.style.backgroundColor = 'white';
        }
        document.getElementById(`${this.currentUrl}-id`).style.backgroundColor = `${this.greyColorHex}`;
        this.permanentElement = document.getElementById(`${this.currentUrl}-id`);
        break;
      }
      case 'favourite-articles': {
        if (this.permanentElement) {
          this.permanentElement.style.backgroundColor = 'white';
        }
        document.getElementById(`${this.currentUrl}-id`).style.backgroundColor = `${this.greyColorHex}`;
        this.permanentElement = document.getElementById(`${this.currentUrl}-id`);
        break;
      }
    }
  }

}

