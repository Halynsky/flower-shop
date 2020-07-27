import { HttpErrorResponse } from "@angular/common/http";
import { httpStatusCodeResponses } from "./Messages";
import * as moment from 'moment';

export function copy(source) {
  return Object.assign({}, source)
}

export function clone(source) {
  return JSON.parse(JSON.stringify(source))
}

export function arrayToHttpParam(array: Array<any>) {
  return array.join(',')
}

/**
 Works only for new angular httpClient
 */
export function getErrorMessage(err: HttpErrorResponse | any): string {
  let message
  try {
    let jsonResponse = JSON.parse(err.error);
    message = jsonResponse.message;

    if (jsonResponse.errors) {
      message += jsonResponse.errors.reduce((accumulator, currentValue) => accumulator + " " + currentValue.defaultMessage + ".", ". ");
    }
    return message
  } catch (e) {
    if (err.error != null && typeof err.error == 'object') {
      message = err.error.message ? err.error.message : httpStatusCodeResponses[err.status];
    } else {
      message = err.error ? err.error : httpStatusCodeResponses[err.status];
    }
    return message ? message : 'Ой, шось пішло не так. Спробуйте, будь ласка, ще раз пізніше.'
  }
}


export function filtersToParams(filters): any {
  let params = {};
  Object.keys(filters).forEach(key => {
    params[key] = filters[key].value;
  });
  return params;
}

export function ngPrimeFiltersToParams(filters): any {
  let params = {};
  Object.keys(filters).forEach(key => {
    let filterObject = filters[key];
    let value = filterObject.value;
    if (filterObject.matchMode == 'range') {
      params[key + 'From'] = value[0];
      params[key + 'To'] = value[1];
    } else if (filterObject.matchMode == 'rangeMoney') {
      params[key + 'From'] = value[0] * 100;
      params[key + 'To'] = value[1] * 100;
    } else if (filterObject.matchMode == 'dateTimeRange') {
      if (value[0] && value[1]) {
        params[key + 'From'] = moment(value[0]).format("YYYY-MM-DD") + "T00:00:00";
        params[key + 'To'] = moment(value[1]).format("YYYY-MM-DD") + "T23:59:59";
      }
    } else if (filterObject.matchMode == 'dateRange') {
      if (value[0] && value[1]) {
        params[key + 'From'] = moment(value[0]).format("YYYY-MM-DD");
        params[key + 'To'] = moment(value[1]).format("YYYY-MM-DD");
      }
    } else {
      params[key] = value;
    }
  });
  return params;
}

export function capitalize(string: string): string {
  if (!string) return "";
  let [s, ...tring] = (string.toLowerCase() as any);
  return [s.toUpperCase(), ...tring].join('');
}

export function enumToArrayList(enumeration): Array<string> {
  return Object.values(enumeration)
    .filter(item => typeof item != 'function')
    .map(item => item.toString());
}
