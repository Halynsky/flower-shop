import { WerehouseOperationType } from "./WerehouseOperationType";
import { FlowerSize } from "./FlowerSize";

export class WerehouseOperation {
  id?: number;
  amount: number;
  date?: string;
  flowerSize: FlowerSize;
  werehouseOperationType: WerehouseOperationType;
}
