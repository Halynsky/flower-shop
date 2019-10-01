import { FlowerType } from "./FlowerType";
import { Color } from "./Color";
import { FlowerSize } from "./FlowerSize";

export class Flower {
  id: number;
  name: string;
  image: string;
  nameOriginal: string;
  groupName: string;
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
  image: string;
  flowerType: FlowerType;
  priceMin: number;
}

export class FlowerFull extends Flower{
  color: Color;
  colorSecondary: Color;
  flowerSizes: Array<FlowerSize> = [];
  created?: string;
  lastSupply?: string;
}
