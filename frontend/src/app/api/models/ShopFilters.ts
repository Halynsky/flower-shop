export class ShopFilters {
  flowerTypeFilters: Array<number> = [];
  colorFilters: Array<number> = [];
  sizeFilters: Array<number> = [];
  searchTerm: string;
  page: number = 0;
  sort: string = 'popularity,DESC';
}

export class ShopFilterParams {
  flowerTypes: string;
  colors: string;
  sizes: string;
  searchTerm: string;
  page: string;
  sort: string;
}
