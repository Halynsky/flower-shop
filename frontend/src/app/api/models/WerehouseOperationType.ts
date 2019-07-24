import {WerehouseOperation} from "./WerehouseOperation";

export class WerehouseOperationType {
  id: number;
  direction: WerehouseOperationType.Direction;
  operationType: WerehouseOperationType.OperationType ;
  werehouseOperations : WerehouseOperation[];
}

export namespace WerehouseOperationType {
  export enum Direction {
    IN = 'IN',
    OUT = 'OUT'
  }
  export enum OperationType {
    GOODS_ARRIVAL = 'GOODS_ARRIVAL',
    INTERNAL_SALE = 'INTERNAL_SALE',
    EXTERNAL_SALE = 'EXTERNAL_SALE',
    GIFT = 'GIFT',
    DEFECT = 'DEFECT'
  }
}
