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
@Table(name = "groups")
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String nameSingle;
    private String nameOriginal;
    private String nameOriginalSingle;

    @ManyToOne
    @JoinColumn(name = "flower_type_id")
    private FlowerType flowerType;

    @OneToMany(mappedBy = "group", fetch = FetchType.LAZY)
    private Set<Flower> flowers;

}
