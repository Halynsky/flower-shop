import { Size } from "./Size";
import { Flower } from "./Flower";

export class FlowerSize {
  id: number;
  price: number;
  priceOld: number;
  amount: number;
  reserved: number;
  available: number;
  size: Size;
  flower: Flower;
}
