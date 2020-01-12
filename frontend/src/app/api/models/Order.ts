import { BucketItem } from "../../models/Bucket";
import { UserShortForAdmin } from "./User";

export class OrderAdmin {
  id: number;
  orderItems: OrderItemAdmin[];
  closed: string;
  created: string;
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
}

export class OrderItemAdmin {
  id: number;
  name: string;
  amount: number;
  price: number;
  image: string;
  sizeName: string;
  flowerSizeId: number;
  available: number;
  orderId: number;
}

export class OrderRequest {
  orderItems: BucketItem[];
  deliveryInfo: any;
  contactInfo: any;
}

export class OrderStatusChangeRequest {
  id: number;
  status: Order.Status;
  comment: string;
  postDeclaration: string
}

export class OrderContactsChangeRequest {
  id: number;
  phone: string;
  deliveryAddress: string
}


export class Order {
  id: number;
  orderItems: OrderItem[];
  closed: string;
  created: string;
  status: Order.Status;
  postDeclaration: string;
  isPaid: boolean;
  totalPrice: number;
  discount: number;
}

export class OrderItem{
  id: number;
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
    DONE = 'DONE',
  }
}
