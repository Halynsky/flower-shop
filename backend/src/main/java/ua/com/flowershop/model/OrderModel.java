package ua.com.flowershop.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

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
    private OrderContactsModel contactInfo;
    private OrderDeliveryModel deliveryInfo;
}
