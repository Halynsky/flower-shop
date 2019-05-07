package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.com.flowershop.entity.Article;
import ua.com.flowershop.projection.ArticleProjection;
import ua.com.flowershop.service.ArticleService;
import ua.com.flowershop.util.annotation.PageableSwagger;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("api/articles")
public class ArticleController {
    @Autowired
    private ArticleService articleService;


    @GetMapping
    @PageableSwagger
    public ResponseEntity<Page<ArticleProjection>> getAll(Pageable pageRequest) {
        return new ResponseEntity<>(articleService.getArticles(pageRequest), OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticleProjection> getById(@PathVariable Long id) {
        return new ResponseEntity<>(articleService.getArticleById(id), OK);
    }

}
