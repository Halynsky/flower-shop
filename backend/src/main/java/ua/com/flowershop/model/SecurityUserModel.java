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
public class SecurityUserModel {
    private Long id;
    private String email;
    private User.Role role;
    private String name;
    private String phone;

    public static SecurityUserModel of(User user) {
        return new SecurityUserModel()
            .setId(user.getId())
            .setEmail(user.getEmail())
            .setRole(user.getRole())
            .setName(user.getName())
            .setPhone(user.getPhone());
    }

}
