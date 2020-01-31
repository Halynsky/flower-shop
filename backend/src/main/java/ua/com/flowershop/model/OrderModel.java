package ua.com.flowershop.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.validation.Valid;
import java.util.List;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class OrderModel {
    private Long id;
    private List<OrderItemModel> orderItems;
    private Long userId;
    @Valid
    private OrderContactsModel contactInfo;
    @Valid
    private OrderDeliveryModel deliveryInfo;
}
