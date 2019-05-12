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
@Table(name = "flower_type_sizes")
public class FlowerTypeSize {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "flower_type_id")
    FlowerType flowerType;

    @ManyToOne
    @JoinColumn(name = "size_id")
    Size size;

}
