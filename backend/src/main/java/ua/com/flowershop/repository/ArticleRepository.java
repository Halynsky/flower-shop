package ua.com.flowershop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.Article;
import ua.com.flowershop.projection.ArticleProjection;

import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    Optional<ArticleProjection> findProjectedById(Long id);
    Page<ArticleProjection> findProjectedBy(Pageable pageRequest);

}
