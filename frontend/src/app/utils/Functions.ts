import { HttpErrorResponse } from "@angular/common/http";
import { httpStatusCodeResponses } from "./Messages";

export function copy(source) {
  return Object.assign({}, source)
}

export function arrayToHttpParam(array: Array<any>) {
  return array.join(',')
}

/**
 Works only for new angular httpClient
 */
export function getErrorMessage(err: HttpErrorResponse | any): string {
  try {
    return JSON.parse(err.error).message;
  } catch (e) {
    if (err.error != null && typeof err.error == 'object') {
      return err.error.message ? err.error.message : httpStatusCodeResponses[err.status];
    } else {
      return err.error ? err.error : httpStatusCodeResponses[err.status];
    }
  }
}
