package ua.com.flowershop.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import ua.com.flowershop.entity.Color;
import ua.com.flowershop.entity.FlowerSize;
import ua.com.flowershop.entity.FlowerType;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class FlowerModel {
    private Long id;
    private String nameOriginal;
    private String name;
    private String image;
    private String groupName;
    private String description;
    private Integer flowerSizeMin;
    private Integer flowerSizeMax;
    private Integer flowerHeightMin;
    private Integer flowerHeightMax;
    private Boolean isNew;
    private Boolean isPopular;
    private Integer popularity;
    private LocalDateTime created;
    private FlowerType flowerType;
    private Color color;
    private Set<FlowerSize> flowerSizes;
}