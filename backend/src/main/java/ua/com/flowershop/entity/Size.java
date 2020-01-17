package ua.com.flowershop.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import ua.com.flowershop.model.SizeModel;

import javax.persistence.*;
import java.util.Set;


@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity()
@Table(name = "sizes")
public class Size {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String name;

    @OneToMany(mappedBy = "size")
    private Set<FlowerTypeSize> flowerTypeSizes;

    @OneToMany(mappedBy = "size")
    private Set<FlowerSize> flowerSizes;

    public static Size of(SizeModel sizeModel) {
        return new Size()
            .setName(sizeModel.getName());
    }

}
