import { Injectable } from "@angular/core";
import { forEach } from "@angular/router/src/utils/collection";

@Injectable({providedIn: 'root'})
export class BucketService {

  private purchases = [];
  public temp;

  getPurchases() {
    return this.purchases;
  }

  addPurchase(purchase) {
    let isPresent = false;
    if (this.purchases.length > 0) {
      this.purchases.forEach((item) => {
        if (purchase.name == item.name && purchase.size == item.size) {
          item.amount++;
          isPresent = true;
        }
      });
      if (!isPresent)
        this.purchases.push(purchase);
    } else {
      this.purchases.push(purchase);
    }
    console.log(this.getPurchases());
  }

  deletePurchase(purchase) {
    let isPresent = false;
    this.purchases.forEach((item) => {
      if (purchase.name == item.name && purchase.size == item.size) {
        item.amount--;
        isPresent = true;
      }
    });
    if (!isPresent)
      this.purchases.pop();

    console.log(this.purchases);
  }
}
