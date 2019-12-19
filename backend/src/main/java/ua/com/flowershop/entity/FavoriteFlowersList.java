package ua.com.flowershop.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.vladmihalcea.hibernate.type.array.IntArrayType;
import com.vladmihalcea.hibernate.type.array.StringArrayType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity()
@Table(name = "favorite_flowers_list")
public class FavoriteFlowersList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private boolean isDefault;
//    @Type( type = "int-array" )
//    @Column(
//        name = "flower_ids",
//        columnDefinition = "bigint[]"
//    )
//    private Long[] flowerIds = new Long[0];



    @JsonIgnore
    @ManyToOne
    @JoinColumn(name="user_id",  foreignKey = @ForeignKey(name = "favorite_flowers_list_user_fkey"))
    private User user;

    @ManyToMany
    @JoinTable(
        name = "flower__favorite_flowers_lists",
        joinColumns = @JoinColumn(name = "favorite_flowers_list_id"),
        inverseJoinColumns = @JoinColumn(name = "flower_id"))
    Set<Flower> flowers;

}
