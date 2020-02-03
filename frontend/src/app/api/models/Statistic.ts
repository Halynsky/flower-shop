export class Statistic {
  amount: number;
  created: string;
  type: string;
  name: string;
}

export namespace Statistic {
  export enum Period {
    MONTH = 'MONTH',
    QUARTER = 'QUARTER',
    YEAR = 'YEAR',
    ALL_TIME = 'ALL_TIME',
  }
}
