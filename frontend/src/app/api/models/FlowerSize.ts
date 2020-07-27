import { Size } from "./Size";
import { Flower } from "./Flower";

export class FlowerSize {
  id: number;
  price: number = 0;
  priceOld: number;
  amount: number;
  reserved: number;
  available: number;
  isAvailable: boolean;
  size: Size;
  flower: Flower;
  code: string;
}
