package ua.com.flowershop.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

import static ua.com.flowershop.entity.Order.Status.NEW;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bucket_items")
public class BucketItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer amount;

    @OneToOne
    @JoinColumn(name = "flower_size_id")
    private FlowerSize flowerSize;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

}
