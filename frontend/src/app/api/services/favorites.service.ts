import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_URL } from "../../utils/Costants";
import { SecurityService } from "../../services/security.service";
import { takeUntil } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class FavoritesService {

  private readonly URL = `${API_URL}/favorites`;

  public favoriteFlowerIds = [];

  constructor(private http: HttpClient,
              private securityService: SecurityService) {
    if(securityService.isAuthenticated()) {
      this.loadFavoriteFlowers();
    } else {
      this.securityService.onLogin
        .pipe(takeUntil(this.securityService.onLogout))
        .subscribe(() => {
        this.loadFavoriteFlowers();
      })
    }


  }

  getFavoriteFlowers() {
    return this.http.get<number[]>(`${this.URL}/flowers`);
  }

  addFavoriteFlower(flowerId) {
    return this.http.post<number[]>(`${this.URL}/flowers/${flowerId}`, null);
  }

  removeFavoriteFlower(flowerId) {
    return this.http.delete<number[]>(`${this.URL}/flowers/${flowerId}`);
  }

  loadFavoriteFlowers() {
    this.getFavoriteFlowers().subscribe(
      favoriteFlowerIds => {
        this.favoriteFlowerIds = favoriteFlowerIds;
      },
      error => {})
  }

}
