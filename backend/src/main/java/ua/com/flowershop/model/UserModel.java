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
    private User.Role role;
    private String name;

    public static UserModel of(User user) {
        return new UserModel()
            .setId(user.getId())
            .setEmail(user.getEmail())
            .setRole(user.getRole())
            .setName(user.getName());
    }

}
