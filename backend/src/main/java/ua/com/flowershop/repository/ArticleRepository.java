package ua.com.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.com.flowershop.entity.Article;

import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {

    List<Article> findAllByOrderByCreatedDesc();

    List<Article> findTop8ByOrderByCreatedDesc();

}
