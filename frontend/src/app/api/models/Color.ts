export class Color {
  id?: number;
  name: string;
  hex: string = '#ff0000';
}

export class ColorAdmin extends Color{
  flowersCount: number
}
