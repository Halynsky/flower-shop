export class Color {
  id?: number;
  name: string;
  hex: string;
}

export class ColorAdmin extends Color{
  flowersCount: number
}
