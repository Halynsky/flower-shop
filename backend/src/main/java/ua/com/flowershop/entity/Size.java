package ua.com.flowershop.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import ua.com.flowershop.model.SizeModel;

import javax.persistence.*;
import java.util.Set;

import static ua.com.flowershop.util.Constants.*;

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
    @Column(unique = true)
    private String name;
    private Integer min;
    private Integer max;

    @OneToMany(mappedBy = "size")
    Set<FlowerTypeSize> flowerTypeSizes;

    @OneToMany(mappedBy = "size")
    Set<FlowerSize> flowerSizes;

    public static Size of(SizeModel sizeModel) {
        return new Size().setMin(sizeModel.getMin())
                .setMax(sizeModel.getMax())
                .setName(sizeModel.getMin() + SLASH + sizeModel.getMax());
    }

}
