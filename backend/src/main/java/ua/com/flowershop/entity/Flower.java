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

    public static final Double RATING_MIN = 0.0;
    public static final Double RATING_MAX = 10.0;
    public static final double RATING_UPRISER = 0.01;
    public static final double POPULARITY_REDUCER = 0.1;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nameOriginal;
    private String name;
    private String image;
    @Column(columnDefinition = "text")
    private String description;
    private Integer flowerSizeMin;
    private Integer flowerSizeMax;
    private Integer flowerHeightMin;
    private Integer flowerHeightMax;

    private Boolean isNew = true;
    private Boolean isPopular;
    @Min(0)
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", foreignKey = @ForeignKey(name = "flower_group_fkey"))
    private Group group;

    @OneToMany(mappedBy = "flower")
    private Set<FlowerSize> flowerSizes;

    @ManyToMany(mappedBy = "flowers")
    private Set<FavoriteFlowersList> favoriteFlowersLists;

}
