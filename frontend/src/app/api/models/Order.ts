import { BucketItem } from "../../models/Bucket";
import { UserShortForAdmin } from "./User";

export class Order {
  id: number;
  // orderItems: BucketItem[];
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
}


export class OrderRequest {
  orderItems: BucketItem[];
  deliveryInfo: any;
  contactInfo: any;
}

export namespace Order {
  export enum Status {
    NEW = 'NEW',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    CANCELED = 'CANCELED',
    RETURNED = 'RETURNED'
  }
}

