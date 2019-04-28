import { Component, OnInit } from '@angular/core';
import { FlowerTypeService } from "../../api/services/flower-type.service";
import { FlowerType } from "../../api/models/FlowerType";
import { Article } from "../../api/models/Article";
import { ArticleService } from "../../api/services/article.service";
import { RestPage } from "../../api/models/RestPage";
import { Pagination } from "../../api/models/Pagination";

@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  articles: RestPage<Article>;

  constructor(private articleService : ArticleService) {

    articleService.getAll(new Pagination(0, 8, "created,DESC")).subscribe(
      articles => this.articles = articles,
      error => console.error(error)
    )

  }

  ngOnInit() {
  }

}
