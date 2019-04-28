package ua.com.flowershop.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.springframework.stereotype.Service;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.time.LocalDateTime;

import static ua.com.flowershop.util.Constants.DATE_TIME_PATTERN;

@Getter
@Service
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "articles")
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String title;
    private String content;
    //    @JsonFormat(pattern = DATE_TIME_PATTERN)
    private LocalDateTime created = LocalDateTime.now();
    private String logo;

}
