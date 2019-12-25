export class BucketItem {
  name: string;
  image: string;
  price: number;
  amount: number;
  size: string;
  flowerType: string;
  flowerSizeId: any;

  constructor(){
  }

}

export class BucketInfo {
  totalItems: number = 0;
  totalAmount: number = 0;
  totalPrice: number = 0;
}
