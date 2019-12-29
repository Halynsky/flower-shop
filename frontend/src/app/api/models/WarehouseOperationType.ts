import { WarehouseOperation } from "./WarehouseOperation";

export class WarehouseOperationType {
  id: number;
  direction: WarehouseOperationType.Direction;
  operationType: WarehouseOperationType.OperationType ;
  warehouseOperations : WarehouseOperation[];
}

export namespace WarehouseOperationType {
  export enum Direction {
    IN = 'IN',
    OUT = 'OUT'
  }
  export enum OperationType {
    GOODS_ARRIVAL = 'GOODS_ARRIVAL',
    SALE = 'SALE',
    EXTERNAL_SALE = 'EXTERNAL_SALE',
    GIFT = 'GIFT',
    DEFECT = 'DEFECT',
    RETURN = 'RETURN'
  }
}
