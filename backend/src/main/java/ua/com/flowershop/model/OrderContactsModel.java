package ua.com.flowershop.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.List;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class OrderContactsModel {
    private Long id;
    @Email(message = "Email не валідний")
    @NotEmpty(message = "Email повинен бути вказаний")
    private String email;
    @NotEmpty(message = "Ім'я повинно бути вказано")
    private String name;
    @Size(min = 10, max = 10)
    @NotEmpty(message = "Телефон повинен бути вказаний")
    private String phone;

    private List<OrderItemModel> orderItems;

}
