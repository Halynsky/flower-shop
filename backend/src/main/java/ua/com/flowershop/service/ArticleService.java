package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import ua.com.flowershop.entity.Article;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.repository.ArticleRepository;

@Slf4j
@Service
public class ArticleService {
    @Autowired
    private ArticleRepository articleRepository;

    public Page<Article> getPopularArticles() {
        return articleRepository.findAll(PageRequest.of(0, 8, new Sort(Sort.Direction.DESC, "created")));
    }

    public Page<Article> getArticles(Pageable pageRequest) {
        return articleRepository.findAll(pageRequest);
    }

    public Article getArticleById(Long id) {
        return articleRepository.findById(id).orElseThrow(NotFoundException::new);
    }

}
