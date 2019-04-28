import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material";

@Injectable({providedIn: 'root'})
export class SnackBarService {

  constructor(private snackBar: MatSnackBar) {}

  open(message: string, action?: string, config?: MatSnackBarConfig) {
    return this.snackBar.open(message, action, config);
  }

  // TODO: Customize messages like showError()
  showSuccess(message: string, action?: string, config?: MatSnackBarConfig) {
    return this.snackBar.open(message, action, config);
  }

  // TODO: Customize messages like showError()
  showWarning(message: string, action?: string, config?: MatSnackBarConfig) {
    return this.snackBar.open(message, action, config);
  }

  showError(message: string, action?: string, config?: MatSnackBarConfig) {
    config.panelClass = "snack-custom-error";
    return this.snackBar.open(message, action, config);
  }

  methodNotImplemented() {
    return this.snackBar.open("Method not implemented");
  }

}
