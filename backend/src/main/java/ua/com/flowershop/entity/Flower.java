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
@Table(name = "flowers")
public class Flower {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String nameOriginal;
    @Column(unique = true)
    private String name;
    private String image;
    // Asiatic Lilium, Oriental Lilium etc
    private String groupName;
    @Column(columnDefinition = "varchar(1000)")
    private String description;
    private Integer flowerSizeMin;
    private Integer flowerSizeMax;
    private Integer flowerHeightMin;
    private Integer flowerHeightMax;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="flower_type_id",  foreignKey = @ForeignKey(name = "flower_flower_type_fkey"), nullable = false)
    private FlowerType flowerType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="color_id",  foreignKey = @ForeignKey(name = "flower_color_fkey"), nullable = false)
    private Color color;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="color_secondary_id",  foreignKey = @ForeignKey(name = "flower_secondary_color_fkey"))
    private Color colorSecondary;

    @OneToMany(mappedBy = "flower")
    Set<FlowerSize> flowerSizes;
}
