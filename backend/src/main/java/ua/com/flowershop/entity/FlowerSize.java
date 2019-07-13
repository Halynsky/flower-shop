package ua.com.flowershop.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity()
@Table(name = "flower__sizes")
public class FlowerSize {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(columnDefinition = "integer default 0")
    private Integer reserved = 0;
    @Column(columnDefinition = "integer default 0")
    private Integer amount = 0;
    @Column(columnDefinition = "integer default 10000")
    private Integer price = 10000;
    @Column(columnDefinition = "integer default 0")
    private Integer sold = 0;

    @ManyToOne
    @JoinColumn(name = "flower_id")
    Flower flower;

    @ManyToOne
    @JoinColumn(name = "size_id")
    Size size;

    @OneToMany(mappedBy = "flowerSize")
    Set<WerehouseOperation> werehouseOperations;

}
