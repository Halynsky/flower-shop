package ua.com.flowershop.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import ua.com.flowershop.entity.User;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class UserModel {
    private Long id;
    private String email;
    private String password;
    private String name;
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
