import { WarehouseOperationType } from "./WarehouseOperationType";
import { FlowerSize } from "./FlowerSize";

export class WarehouseOperation {
  id?: number;
  amount: number;
  isActive: boolean;
  date?: string;
  flowerSize: FlowerSize;
  warehouseOperationType: WarehouseOperationType;
}
