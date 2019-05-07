package ua.com.flowershop.projection;

import java.time.LocalDateTime;

public interface ArticleProjection {
    Long getId();
    String getTitle();
    String getContent();
    LocalDateTime getCreated();
    String getImage();
}
