package ua.com.flowershop.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationModel {
    private Long id;
    @Email(message = "Email не валідний")
    @NotEmpty(message = "Email повинен бути вказаний")
    private String email;
    private String password;
    private String name;
    private String phone;
}
