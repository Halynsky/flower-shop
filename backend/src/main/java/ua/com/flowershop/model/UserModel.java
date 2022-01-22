package ua.com.flowershop.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import ua.com.flowershop.entity.User;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class UserModel {
    private Long id;
    @Email
    private String email;
    @NotEmpty
    private String password;
    @NotEmpty
    private String name;
    @NotEmpty
    private String phone;
    private Boolean isEnabled;
    private User.Role role;

    public static UserModel of(User user) {
        return new UserModel()
            .setId(user.getId())
            .setEmail(user.getEmail())
            .setName(user.getName())
            .setPhone(user.getPhone())
            .setIsEnabled(user.getIsEnabled())
            .setRole(user.getRole());
    }

}
