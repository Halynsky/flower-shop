import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class GlobalSearchService {

  public onSearchTermChange: ReplaySubject<any> = new ReplaySubject(1);

  constructor(private router: Router) {
    this.onSearchTermChange.subscribe(searchTerm => {
      if (this.router.url !== '/shop') {
        this.router.navigate(['shop'])
      }
    })
  }
}
