package ua.com.flowershop.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.persistence.*;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity()
@Table(name = "flower_sizes")
public class FlowerSize {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer reserved;
    private Integer amount;
    private Integer price;

    @ManyToOne
    @JoinColumn(name = "flower_id")
    Flower flower;

    @ManyToOne
    @JoinColumn(name = "size_id")
    Size size;

}
