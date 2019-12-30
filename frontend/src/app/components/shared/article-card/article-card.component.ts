import { Component, Input, OnInit } from '@angular/core';
import { Article } from "../../../api/models/Article";
import { SnackBarService } from "../../../services/snak-bar.service";

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit {

  @Input()
  article: Article;

  constructor(private snackBar: SnackBarService) {
  }

  ngOnInit() {
  }

  // TODO: Implement this
  addToFavorite() {
    this.snackBar.methodNotImplemented();
  }

  // TODO: Implement this
  share() {
    this.snackBar.methodNotImplemented();
  }

}
