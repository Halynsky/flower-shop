package ua.com.flowershop.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import ua.com.flowershop.model.ColorModel;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity()
@Table(name = "colors")
public class Color {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String name;
    @Column(unique = true, nullable = false)
    private String hex;

    @OneToMany(mappedBy = "color", fetch = FetchType.LAZY)
    private Set<Flower> flowers;

    @OneToMany(mappedBy = "colorSecondary", fetch = FetchType.LAZY)
    private Set<Flower> flowersSecondaryColorSet;


    public static Color of(ColorModel colorModel) {
        return new Color().setName(colorModel.getName())
            .setHex(colorModel.getHex());
    }

}
