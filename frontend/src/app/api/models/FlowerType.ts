export class FlowerType {
  id?: number;
  name: string;
  nameSingle: string;
  nameOriginal: string;
  groupName: string;
  flowersCount: number;
  availableFlowersCount: number;
  image: string;
  plantingMaterialType: string;
  description: string;
}

export class FlowerTypeImageNameTupleWithAvailable {
  id?: number;
  name: string;
  image: string;
  availableFlowersCount: number;
}
