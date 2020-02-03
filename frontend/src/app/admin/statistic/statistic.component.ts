import { Component, OnInit } from '@angular/core';
import { SelectItem } from "primeng";
import { Statistic } from "../../api/models/Statistic";
import { StatisticService } from "../../api/services/statistic.service";
import { capitalize, clone, enumToArrayList, getErrorMessage } from "../../utils/Functions";
import { SnackBarService } from "../../services/snak-bar.service";
import * as moment from 'moment'
import ChartDataLabels from 'chartjs-plugin-datalabels';

enum Colors {
  GREEN = 'green',
  DARKORANGE = 'darkorange',
  BLUE = 'blue',
  YELLOW = 'yellow',
  RED = 'red',
  CYAN = 'cyan',
  KHAKI = 'khaki',
  BROWN = 'brown',
  FUCHSIA = 'fuchsia',
  DARKCYAN = 'darkcyan'
}

enum LineColors {
  USERS_ACTIVATED = 'darkcyan',
  ORDERS_CREATED = 'green',
  ORDERS_ACTIVE = 'green',
  ORDERS_DONE = 'darkorange',
  ORDERS_PAID = 'green',
  ORDERS_NOT_PAID = 'red',
}

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {

  plugin = ChartDataLabels;

  defaultOptionsPie: any  = {
    plugins: {
      datalabels: {
        align: 'end',
        borderRadius: 2,
        color: 'white',
        font: {
          weight: 'bold'
        }
      }
    }
  };

  defaultOptionsPieMoney: any = clone(this.defaultOptionsPie);

  defaultOptionsLine: any  = {
    plugins: {
      datalabels: {
        align: 'end',
        anchor: 'end',
        borderRadius: 2,
        backgroundColor: 'grey',
        color: 'white',
        font: {
          weight: 'bold',
          size: 10
        },
        padding: {
          top: 1,
          right: 2,
          bottom: 1,
          left: 2
        }
      }
    }
  };

  // usersRegistrationStructuralOptions = clone(this.defaultOptionsPie);


  statisticPeriods: Array<SelectItem> = [
    {label: 'За місяць', value: 'MONTH'},
    {label: 'За квартал', value: 'QUARTER'},
    {label: 'За рік', value: 'YEAR'},
    {label: 'За весь час', value: 'ALL_TIME'},
  ];

  statisticPeriod = Statistic.Period.MONTH;

  usersRegistrationStructural = {labels: [], datasets: []};
  usersRegistrationDynamical = {labels: [], datasets: []};
  ordersByStatusCountStructural = {labels: [], datasets: []};
  ordersByStatusCountDynamical = {labels: [], datasets: []};
  ordersByPaidCountStructural = {labels: [], datasets: []};
  ordersByPaidAmountStructural = {labels: [], datasets: []};

  constructor(private statisticService: StatisticService,
              private snackBarService: SnackBarService) {
    this.defaultOptionsPieMoney.plugins.datalabels.formatter = this.moneyFormatter;
  }

  ngOnInit() {
    this.getUsersRegistrationStatisticStructural();
    this.getUsersRegistrationStatisticDynamical();
    this.getOrderByStatusCountStatisticStructural();
    this.getOrderByStatusCountStatisticDynamical();
    this.getOrderByPaidCountStatisticStructural();
    this.getOrderByPaidAmountStatisticStructural();
  }

  getUsersRegistrationStatisticStructural() {
    this.statisticService.getUsersRegistrationStatisticStructural().subscribe((statistic: Array<Statistic>) => {
      this.usersRegistrationStructural.labels = statistic.map(item => capitalize(item.name));
      this.usersRegistrationStructural.datasets = [{
        data: statistic.map(item => item.amount),
        backgroundColor: enumToArrayList(Colors)
      }];
    }, error => this.snackBarService.showError(getErrorMessage(error)));
  }

  getUsersRegistrationStatisticDynamical(period: Statistic.Period = Statistic.Period.MONTH) {
    this.statisticService.getUsersRegistrationStatisticDynamical(period).subscribe((statistic: Array<Statistic>) => {
      this.usersRegistrationDynamical = this.generateData(statistic, period);
    }, error => this.snackBarService.showError(getErrorMessage(error)));
  }

  getOrderByStatusCountStatisticStructural(period: Statistic.Period = Statistic.Period.MONTH) {
    this.statisticService.getOrderByStatusCountStatisticStructural(period).subscribe((statistic: Array<Statistic>) => {
      this.ordersByStatusCountStructural.labels = statistic.map(item => capitalize(item.name));
      this.ordersByStatusCountStructural.datasets = [{
        data: statistic.map(item => item.amount),
        backgroundColor: enumToArrayList(Colors)
      }];
    }, error => this.snackBarService.showError(getErrorMessage(error)));
  }

  getOrderByStatusCountStatisticDynamical(period: Statistic.Period = Statistic.Period.MONTH) {
    this.statisticService.getOrderByStatusCountStatisticDynamical(period).subscribe((statistic: Array<Statistic>) => {
      this.ordersByStatusCountDynamical = this.generateData(statistic, period);
    }, error => this.snackBarService.showError(getErrorMessage(error)));
  }

  getOrderByPaidCountStatisticStructural(period: Statistic.Period = Statistic.Period.MONTH) {
    this.statisticService.getOrderByPaidCountStatisticStructural(period).subscribe((statistic: Array<Statistic>) => {
      this.ordersByPaidCountStructural.labels = statistic.map(item => capitalize(item.name));
      this.ordersByPaidCountStructural.datasets = [{
        data: statistic.map(item => item.amount),
        backgroundColor: enumToArrayList(Colors)
      }];
    }, error => this.snackBarService.showError(getErrorMessage(error)));
  }

  getOrderByPaidAmountStatisticStructural(period: Statistic.Period = Statistic.Period.MONTH) {
    this.statisticService.getOrderByPaidAmountStatisticStructural(period).subscribe((statistic: Array<Statistic>) => {
      this.ordersByPaidAmountStructural.labels = statistic.map(item => capitalize(item.name));
      this.ordersByPaidAmountStructural.datasets = [{
        data: statistic.map(item => item.amount),
        backgroundColor: enumToArrayList(Colors)
      }];
    }, error => this.snackBarService.showError(getErrorMessage(error)));
  }

  private generateData(statistic: Array<Statistic>, period: Statistic.Period, modifyAmount: (val) => {} = undefined): { labels: Array<string>, datasets: Array<any> } {
    const chartStatisticMap = new Map();
    const periods: Array<string> = [];
    let dateFormat: string;

    if (period == Statistic.Period.MONTH) {
      dateFormat = 'D MMM'
    } else if (period == Statistic.Period.YEAR || period == Statistic.Period.QUARTER) {
      dateFormat = 'MMM'
    } else {
      dateFormat = 'MMM YY'
    }

    let firstType = statistic[0].type;
    let periodCount = statistic.filter(item => item.type == firstType).length;

    statistic.forEach((statistic: Statistic, index: number) => {

      if (index < periodCount) {
        if (statistic.created) {
          periods.push(moment(statistic.created).format(dateFormat));
        } else {
          periods.push(statistic.name);
        }
      }

      if (chartStatisticMap.has(statistic.type)) {
        const dataset = chartStatisticMap.get(statistic.type);
        const amount = typeof modifyAmount == 'function' ? modifyAmount(statistic.amount) : statistic.amount;
        dataset.data.push(amount);
        chartStatisticMap.set(statistic.type, dataset);
      } else {
        const amount = typeof modifyAmount == 'function' ? modifyAmount(statistic.amount) : statistic.amount;
        const dataset = {
          label: statistic.name,
          fill: false,
          backgroundColor: LineColors[statistic.type],
          borderColor: LineColors[statistic.type],
          data: [amount],
        };
        chartStatisticMap.set(statistic.type, dataset);
      }
    });

    return {
      labels: periods,
      datasets: Array.from(chartStatisticMap.values())
    };
  }

  onUsersRegistrationDynamicalPeriodChange(event: any) {
    this.getUsersRegistrationStatisticDynamical(event);
  }

  onOrdersByStatusCountStructuralPeriodChange(event: any) {
    this.getOrderByStatusCountStatisticDynamical(event)
  }

  onOrdersByStatusCountDynamicalPeriodChange(event: any) {
    this.getOrderByStatusCountStatisticStructural(event);
  }


  onOrderByPaidCountStatisticStructuralPeriodChange(event: any) {
    this.getOrderByPaidCountStatisticStructural(event);
  }

  onOrderByPaidAmountStatisticStructuralPeriodChange(event: any) {
    this.getOrderByPaidAmountStatisticStructural(event)
  }

  moneyFormatter(value, context) {
    return value + " грн";
  }

}
