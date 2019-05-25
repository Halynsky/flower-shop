import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material";

@Injectable({providedIn: 'root'})
export class SnackBarService {

  private readonly DEFAULT_ERROR_DURATION = 10000;

  constructor(private snackBar: MatSnackBar) {}

  open(message: string, action?: string, config: MatSnackBarConfig = {}) {
    return this.snackBar.open(message, action, config);
  }

  showSuccess(message: string, action?: string, config: MatSnackBarConfig = {}) {
    config.panelClass = "snack-custom-success";
    return this.snackBar.open(message, action, config);
  }

  showWarning(message: string, action?: string, config: MatSnackBarConfig = {}) {
    config.panelClass = "snack-custom-warning";
    return this.snackBar.open(message, action, config);
  }

  showError(message: string, action?: string, config: MatSnackBarConfig = {}) {
    config.panelClass = "snack-custom-error";
    config.duration = config.duration ? config.duration : this.DEFAULT_ERROR_DURATION;
    return this.snackBar.open(message, action, config);
  }

  methodNotImplemented() {
    return this.snackBar.open("Method not implemented");
  }

}
