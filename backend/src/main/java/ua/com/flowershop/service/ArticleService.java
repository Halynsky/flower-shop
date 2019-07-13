package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.projection.ArticleProjection;
import ua.com.flowershop.repository.ArticleRepository;

@Slf4j
@Service
public class ArticleService {
    
    @Autowired private ArticleRepository articleRepository;

    public Page<ArticleProjection> getArticles(Pageable pageRequest) {
        return articleRepository.findProjectedBy(pageRequest);
    }

    public ArticleProjection getArticleById(Long id) {
        return articleRepository.findProjectedById(id).orElseThrow(NotFoundException::new);
    }

}
