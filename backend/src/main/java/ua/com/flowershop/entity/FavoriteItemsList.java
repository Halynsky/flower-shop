package ua.com.flowershop.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity()
@Table(name = "favorite_items_list")
public class FavoriteItemsList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private boolean isDefault;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name="user_id",  foreignKey = @ForeignKey(name = "favorite_flowers_list_user_fkey"))
    private User user;

//    @ManyToMany
//    @JoinTable(
//        name = "flowers__favorite_flowers_lists",
//        joinColumns = @JoinColumn(name = "favorite_flowers_list_id"),
//        inverseJoinColumns = @JoinColumn(name = "flower_id"))
//    Set<Flower> flowers = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "flower_sizes__favorite_items_lists",
        joinColumns = @JoinColumn(name = "favorite_items_list_id"),
        inverseJoinColumns = @JoinColumn(name = "flower_size_id"))
    Set<FlowerSize> flowerSizes = new HashSet<>();

}
