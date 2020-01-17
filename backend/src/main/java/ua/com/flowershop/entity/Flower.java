package ua.com.flowershop.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.time.LocalDateTime;
import java.util.Set;

import static java.time.LocalDateTime.now;

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
    @Column(columnDefinition = "varchar(5000)")
    private String description;
    private Integer flowerSizeMin;
    private Integer flowerSizeMax;
    private Integer flowerHeightMin;
    private Integer flowerHeightMax;

    private Boolean isNew = true;
    private Boolean isPopular;
    @Min(1)
    @Max(10)
    private Double popularity = 1.0;
    @Column(columnDefinition = "timestamp default timezone('utc'::text, now())")
    private LocalDateTime created = now();
    private LocalDateTime lastSupply;
    private LocalDateTime nextSupply;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flower_type_id", foreignKey = @ForeignKey(name = "flower_flower_type_fkey"), nullable = false)
    private FlowerType flowerType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "color_id", foreignKey = @ForeignKey(name = "flower_color_fkey"), nullable = false)
    private Color color;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "color_secondary_id", foreignKey = @ForeignKey(name = "flower_secondary_color_fkey"))
    private Color colorSecondary;

    @OneToMany(mappedBy = "flower")
    private Set<FlowerSize> flowerSizes;

    @ManyToMany(mappedBy = "flowers")
    Set<FavoriteFlowersList> favoriteFlowersLists;

}
