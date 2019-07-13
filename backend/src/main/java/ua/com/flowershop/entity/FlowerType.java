package ua.com.flowershop.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import ua.com.flowershop.model.FlowerTypeModel;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Getter
@Setter
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
    @Column(unique = true)
    private String nameSingle;

    @OneToMany(mappedBy = "flowerType", fetch = FetchType.LAZY)
    private List<Flower> flowers;

    @OneToMany(mappedBy = "flowerType")
    Set<FlowerTypeSize> flowerTypeSizes;

    public static FlowerType of(FlowerTypeModel flowerTypeModel) {
        return new FlowerType().setName(flowerTypeModel.getName())
            .setNameSingle(flowerTypeModel.getNameSingle());
    }

}
