import { BucketItem } from "../../models/Bucket";
import { UserShortForAdmin } from "./User";

export class OrderAdmin {
  id: any;
  orderItems: OrderItemAdmin[] = [];
  closed: string;
  sent: string;
  created: string;
  paid: string;
  status: Order.Status;
  user: UserShortForAdmin;
  comment: string;
  note: string;
  deliveryAddress: string;
  postDeclaration: string;
  isPaid: boolean;
  phone: string;
  totalPrice: number;
  discount: number;
  priceToPay: number;
  advancePayment: number;
}

export class OrderItemAdmin {
  id: any;
  name: string;
  amount: number;
  price: number;
  image: string;
  sizeName: string;
  flowerSizeId: number;
  available: number;
  flowerTypeName: number;
  orderId: number;
}

export class OrderRequest {
  orderItems: BucketItem[];
  deliveryInfo: any;
  contactInfo: any;
}

export class OrderStatusChangeRequest {
  id: any;
  status: Order.Status;
  comment: string;
  postDeclaration: string;
  date = new Date();
}

export class OrderContactsChangeRequest {
  id: any;
  phone: string;
  deliveryAddress: string
}


export class Order {
  id: any;
  orderItems: OrderItem[];
  closed: string;
  created: string;
  status: Order.Status;
  postDeclaration: string;
  paid: string;
  totalPrice: number;
  discount: number;
  advancePayment: number;
}

export class OrderItem {
  id: any;
  name: string;
  amount: number;
  price: number;
  image: string;
  sizeName: string;
  flowerSizeId: number;
  flowerTypeName: number;
  orderId: number;
}

export namespace Order {
  export enum Status {
    NEW = 'NEW',
    PROCESSING = 'PROCESSING',
    DELIVERING = 'DELIVERING',
    RETURNED = 'RETURNED',
    CANCELED = 'CANCELED',
    CANCELED_AUTO = 'CANCELED_AUTO',
    DONE = 'DONE',
  }
}
