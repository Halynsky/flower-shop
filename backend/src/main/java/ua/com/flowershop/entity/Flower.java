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
@Table(name = "flowers")
public class Flower {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String nameOriginal;
    @Column(unique = true)
    private String name;
    // Asiatic Lilium, Oriental Lilium etc
    private String groupName;
    @Column(columnDefinition = "varchar(500)")
    private String description;
    private Integer flowerSizeMin;
    private Integer flowerSizeMax;
    private Integer flowerHeightMin;
    private Integer flowerHeightMax;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="flower_type_id",  foreignKey = @ForeignKey(name = "flower_flower_typ_fkey"), nullable = false)
    private FlowerType flowerType;

}
