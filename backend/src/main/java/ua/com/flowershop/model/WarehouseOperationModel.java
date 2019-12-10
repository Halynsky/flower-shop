package ua.com.flowershop.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import ua.com.flowershop.entity.FlowerSize;
import ua.com.flowershop.entity.WarehouseOperationType;

import javax.validation.constraints.NotNull;


@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseOperationModel {

    @NotNull
    Integer amount;
    @NotNull
    FlowerSize flowerSize;
    @NotNull
    WarehouseOperationType warehouseOperationType;

}
