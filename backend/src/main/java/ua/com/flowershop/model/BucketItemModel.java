package ua.com.flowershop.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class BucketItemModel {
    String name;
    Integer amount;
    String image;
    Integer price;
    String sizeName;
    String flowerTypeName;
    Long flowerSizeId;
}
