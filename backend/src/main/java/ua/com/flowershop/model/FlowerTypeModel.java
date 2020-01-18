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
public class FlowerTypeModel {
    private Long id;
    private String name;
    private String nameSingle;
    private String nameOriginal;
    private String plantingMaterialType;
    private String description;
}
