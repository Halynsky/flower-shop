package ua.com.flowershop.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.validation.constraints.Size;
import java.util.List;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class OrderContactsModel {
    private Long id;
    private List<OrderItemModel> orderItems;
    private Long userId;
    private String name;
    @Size(min = 10, max = 10)
    private String phone;
    private String email;
}
