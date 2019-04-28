import { Component, Input, OnInit } from '@angular/core';
import { FlowerType } from "../../../../api/models/FlowerType";
import { Article } from "../../../../api/models/Article";

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit {

  @Input()
  article: Article;
  
  constructor() {
  }

  ngOnInit() {
  }

}
