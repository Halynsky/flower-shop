import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class CatalogService {

  private showCatalog: Boolean = false;

  getShowCatalog() {
    return this.showCatalog;
  }

  setShowCatalog(showCatalog: Boolean) {
    this.showCatalog = showCatalog;
  }

}
