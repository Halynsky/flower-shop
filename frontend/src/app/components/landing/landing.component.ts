import { Component, OnDestroy, OnInit } from '@angular/core';
import { Article } from "../../api/models/Article";
import { ArticleService } from "../../api/services/article.service";
import { RestPage } from "../../api/models/RestPage";
import { Pagination } from "../../api/models/Pagination";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {

  private readonly destroyed$ = new Subject<void>();

  articles: RestPage<Article>;

  constructor(private articleService : ArticleService) {

    articleService.getAll(new Pagination(0, 8, "created,DESC"))
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
      articles => this.articles = articles,
      error => console.error(error)
    )

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
