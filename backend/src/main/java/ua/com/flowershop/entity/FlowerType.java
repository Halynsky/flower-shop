package ua.com.flowershop.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Getter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity()
@Table(name = "flower_types")
public class FlowerType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String name;

    @OneToMany(mappedBy = "flowerType", fetch = FetchType.LAZY)
    private List<Flower> flowers;

    @JoinTable(name="flower_type_sizes",
            joinColumns=@JoinColumn(name="flower_type_id", referencedColumnName="id"),
            inverseJoinColumns=@JoinColumn(name="size_id", referencedColumnName="id"))
    private Set<Size> sizes;

}
