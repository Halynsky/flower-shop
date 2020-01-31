import { Flower } from "./Flower";
import { FlowerType } from "./FlowerType";

export class Group {
  id?: number;
  name: string;
  nameSingle: string;
  nameOriginal: string;
  nameOriginalSingle: string;
  description: string;
}

export class GroupAdmin extends Group {
  flowerType: FlowerType;
  flower: Flower;
  flowersCount: number;
}
