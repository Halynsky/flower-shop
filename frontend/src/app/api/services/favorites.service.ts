import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_URL } from "../../utils/Costants";
import { SecurityService } from "../../services/security.service";
import { FlowerSize } from "../models/FlowerSize";

@Injectable({providedIn: 'root'})
export class FavoritesService {

  private readonly URL = `${API_URL}/favorites`;

  public favoriteItemsIds = [];

  constructor(private http: HttpClient,
              private securityService: SecurityService) {
    if(securityService.isAuthenticated()) {
      this.loadFavoriteItemsIds();
    }

    this.securityService.onLogin
      .subscribe(() => {
        this.loadFavoriteItemsIds();
      });

    this.securityService.onLogout
      .subscribe(() => {
        this.favoriteItemsIds = [];
      });
  }

  getFavoriteItemsIds() {
    return this.http.get<number[]>(`${this.URL}/items/ids`);
  }

  getFavoriteItems() {
    return this.http.get<FlowerSize[]>(`${this.URL}/items`);
  }

  addFavoriteItem(itemId) {
    return this.http.post<number[]>(`${this.URL}/items/${itemId}`, null);
  }

  removeFavoriteItem(itemId) {
    return this.http.delete<number[]>(`${this.URL}/items/${itemId}`);
  }

  loadFavoriteItemsIds() {
    this.getFavoriteItemsIds().subscribe(
      favoriteItemsIds => {
        this.favoriteItemsIds = favoriteItemsIds;
      },
      error => {})
  }

}
