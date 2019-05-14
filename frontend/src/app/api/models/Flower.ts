import { FlowerType } from "./FlowerType";
import { Color } from "colors";

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
}

export class FlowerFull extends Flower{
  color: Color;
  colorSecondary: Color;
}
