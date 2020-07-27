package ua.com.flowershop.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import ua.com.flowershop.entity.Order;

import java.time.LocalDate;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusChangeRequestModel {
    private Order.Status status;
    private String comment;
    private String postDeclaration;
    private LocalDate date;
}
