import { FlowerType } from "./FlowerType";
import { Color } from "./Color";
import { FlowerSize } from "./FlowerSize";
import { Group } from "./Group";

export class Flower {
  id: number;
  name: string;
  image: string;
  nameOriginal: string;
  group: Group;
  description: string;
  flowerHeightMin: number;
  flowerHeightMax: number;
  flowerSizeMin: number;
  flowerSizeMax: number;
  flowerType: FlowerType;
  isNew: boolean = false;
  isPopular: boolean = false;
  popularity: number;
}

export class FlowerShort {
  id: number;
  name: string;
  nameOriginal: string;
  image: string;
  hasAvailableFlowerSize: boolean;
  flowerType: FlowerType;
  isNew: boolean = false;
  isPopular: boolean = false;
  priceMin: number;
  group: Group;
}

export class FlowerFull extends Flower{
  color: Color;
  colorSecondary: Color;
  flowerSizes: Array<FlowerSize> = [];
  created?: string;
  lastSupply?: string;
  plantingMaterialType: string
}
