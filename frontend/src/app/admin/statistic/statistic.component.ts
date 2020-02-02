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
  ACTIVATED = 'darkcyan',
}

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {

  plugin = ChartDataLabels;

  defaultOptionsPie = {
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

  defaultOptionsLine = {
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

  usersRegistrationStructuralOptions = clone(this.defaultOptionsPie);


  statisticPeriods: Array<SelectItem> = [
    {label: 'За місяць', value: 'MONTH'},
    {label: 'За квартал', value: 'QUARTER'},
    {label: 'За рік', value: 'YEAR'},
    {label: 'За весь час', value: 'ALL_TIME'},
  ];

  statisticPeriod = Statistic.Period.MONTH;

  usersRegistrationStructural = {labels: [], datasets: []};
  usersRegistrationDynamical = {labels: [], datasets: []};

  constructor(private statisticService: StatisticService,
              private snackBarService: SnackBarService) {

  }

  ngOnInit() {
    this.getUserRegistrationStatisticStructural();
    this.getUsersRegistrationStatisticDynamical();
  }

  getUserRegistrationStatisticStructural(period: Statistic.Period = Statistic.Period.MONTH) {
    this.statisticService.getUserRegistrationStatisticStructural().subscribe((statistic: Array<Statistic>) => {
      this.usersRegistrationStructural.labels = statistic.map(item => capitalize(item.name));
      this.usersRegistrationStructural.datasets = [{
        data: statistic.map(item => item.amount),
        backgroundColor: enumToArrayList(Colors)
      }];
      console.log(this.usersRegistrationStructural);
    }, error => this.snackBarService.showError(getErrorMessage(error)));
  }

  getUsersRegistrationStatisticDynamical(period: Statistic.Period = Statistic.Period.MONTH) {
    this.statisticService.getUsersRegistrationStatisticDynamical(period).subscribe((statistic: Array<Statistic>) => {
      this.usersRegistrationDynamical = this.generateData(statistic, period);
      console.log(this.usersRegistrationDynamical);
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

}
