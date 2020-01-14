package ua.com.flowershop.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import ua.com.flowershop.entity.Order;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class OrderDeliveryModel {
    private Order.DeliveryType deliveryType;
    private String city;
    private String street;
    private String house;
    private String apartment;
    private String novaPoshtaDepartment;
    private String receiverFullName;
    private String receiverPhone;
    private String comment;
}
